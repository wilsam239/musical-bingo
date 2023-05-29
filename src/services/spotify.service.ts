import type { SpotifyUser } from '@/types/user'
import { Observable, catchError, from, map, mergeMap, of, tap, throwError } from 'rxjs'
import { SnackbarService } from './snackbar.service'

class Spotify {
  private snack = SnackbarService
  private url = 'https://api.spotify.com/v1/'
  private userSession: {
    client_id: string
    access_token?: string
    expiry?: number
  }

  private me!: SpotifyUser

  constructor() {
    this.userSession = JSON.parse(
      localStorage.getItem('userSession') ??
        JSON.stringify({
          client_id: ''
        })
    )
  }

  /**
   * Taken from the api docs
   * https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
   * @param length
   */
  private generateCodeVerifier(length: number) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  /**
   * Taken from the api docs
   * https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
   */
  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  /**
   * Go to the spotify oauth page to get an exchange code
   */
  async loginNoCode() {
    const verifier = this.generateCodeVerifier(128)
    const challenge = await this.generateCodeChallenge(verifier)

    localStorage.setItem('verifier', verifier)
    const params = new URLSearchParams()
    params.append('client_id', this.clientID)
    params.append('response_type', 'code')
    params.append('redirect_uri', `${location.protocol}//${location.host}/musical-bingo/`)
    params.append(
      'scope',
      'user-read-private user-read-email playlist-modify-public playlist-modify-private'
    )
    params.append('code_challenge_method', 'S256')
    params.append('code_challenge', challenge)

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  /**
   * After coming back from spotify oauth page, call the api to login now that we have an exchange code
   * @param code Exchange code from spotify api
   * @returns
   */
  loginWithCode(code: string) {
    const verifier = localStorage.getItem('verifier')
    const params = new URLSearchParams()
    params.append('client_id', this.clientID)
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', `${location.protocol}//${location.host}/musical-bingo/`)
    params.append('code_verifier', verifier!)

    return this.api('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    }).pipe(
      tap((response) => {
        console.log(response)
        this.access_token = response.access_token
        this.expiry = response.expires_in
      }),
      mergeMap(() => this.fetchMe())
    )
  }

  /**
   * Get the users info from the /me endpoint
   */
  fetchMe() {
    return this.api(`me`, {
      headers: {
        authorization: `Bearer ${this.access_token}`
      }
    }).pipe(
      tap((me) => {
        this.me = me
        console.log(me)
      })
    )
  }

  /**
   * Fetch a spotify playlist, and if necessary, make a subplaylist out of it so that we can use it for bingo
   * @param id Id of the spotify playlist
   * @returns
   */
  fetchPlaylist(id: string) {
    return this.api(`playlists/${id}`, {
      headers: {
        authorization: `Bearer ${this.access_token}`
      }
    }).pipe(
      tap((playlist: SpotifyPlaylist) => {
        console.log(playlist)
      }),
      mergeMap((playlist: SpotifyPlaylist) => {
        // CUrrently this is hardcoded to 25
        if (playlist.tracks.items.length > 25) {
          return this.makeSubPlaylist(playlist, 25)
        } else {
          return of(playlist)
        }
      })
    )
  }

  /**
   * Shuffle the track list around so that we get a unique set of songs that aren't in order
   * @param strings
   * @returns
   */
  private shuffle(strings: Track[]) {
    const shuffledArray = strings.slice()

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }

    return shuffledArray
  }

  /**
   * Generate a bingo playlist of fixed length
   * @param p The original playlist
   * @param length The length of the new one
   * @returns
   */
  makeSubPlaylist(p: SpotifyPlaylist, length: number): Observable<any> {
    if (length > p.tracks.items.length) {
      return throwError(() => {
        return {
          title: 'Not enough tracks',
          message: `Cannot make a playlist that has ${length} tracks, when the original playlist doesn't have that many songs`
        }
      })
    }
    // Construct the body
    const today = new Date(Date.now())
    const body = {
      name: `Musical Bingo - ${today.toLocaleDateString()}`,
      description: `Auto generated bingo for ${today.toLocaleDateString()}`,
      public: false
    }

    // Get the song selection
    const songSelection = this.shuffle(p.tracks.items).slice(0, length)

    // Create a new playlist
    return this.api(`users/${this.me.id}/playlists`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.access_token}`
      },
      body: JSON.stringify(body)
    }).pipe(
      mergeMap((newPlaylist: SpotifyPlaylist) => {
        const tracksBody = {
          position: 0,
          uris: songSelection.map((t) => t.track.uri)
        }
        // Add the songs to the new playlist
        return this.api(`playlists/${newPlaylist.id}/tracks`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${this.access_token}`
          },
          body: JSON.stringify(tracksBody)
        }).pipe(
          mergeMap(() => {
            return this.fetchPlaylist(newPlaylist.id)
          })
        )
      })
    )
  }

  /**
   * The api call that is made to spotify with fetch requests and converted to rxjs
   * @param _url URL to go to, can be just a subsection eg: /playlists or can be a whole url
   *
   * If a subssection, it will be prepended with the spotify api url
   * @param init The request headers, body, and auth
   * @returns
   */
  private api(_url: string, init?: RequestInit) {
    const url = _url.startsWith('https://') ? _url : this.url + _url
    return from(fetch(url, init)).pipe(
      mergeMap((response) => {
        if (response.status < 400) {
          return response.text()
        } else {
          return from(response.text()).pipe(
            map((body) => JSON.parse(body)),
            mergeMap((body) => {
              return throwError(() => {
                return { title: body.error, message: body.error_description }
              })
            })
          )
        }
      }),
      map((response) => JSON.parse(response)),
      catchError((err) => {
        console.error(err)
        this.snack.msgError('API Error', err.message)
        return throwError(() => err)
      })
    )
  }

  set clientID(id: string) {
    this.userSession.client_id = id
    localStorage.setItem('userSession', JSON.stringify(this.userSession))
  }

  set expiry(expires_in: number) {
    this.userSession.expiry = Date.now() + expires_in * 1000
    localStorage.setItem('userSession', JSON.stringify(this.userSession))
  }

  set access_token(at: string) {
    this.userSession.access_token = at
    localStorage.setItem('userSession', JSON.stringify(this.userSession))
  }

  get clientID() {
    return this.userSession.client_id
  }

  get access_token() {
    return this.userSession.access_token ?? ''
  }

  get isLoggedIn() {
    return (
      !!this.userSession.access_token &&
      !!this.userSession.expiry &&
      this.userSession.expiry > Date.now()
    )
  }
}

export const SpotifyService = new Spotify()