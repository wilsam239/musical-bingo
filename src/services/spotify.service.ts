import { catchError, from, map, mergeMap, of, tap, throwError } from 'rxjs'
import { SnackbarService } from './snackbar.service'

export class Spotify {
  private snack = SnackbarService
  private url = 'https://api.spotify.com/v1/'
  private userSession: {
    client_id: string
    client_secret: string
    access_token?: string
    expiry?: number
  }

  constructor() {
    this.userSession = JSON.parse(
      localStorage.getItem('userSession') ??
        JSON.stringify({
          client_id: '',
          client_secret: ''
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
      })
    )
  }
  login(id: string, secret: string) {
    this.clientID = id
    this.clientSecret = secret

    return this.api('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${id}&client_secret=${secret}`
    }).pipe(
      tap((response) => {
        this.access_token = response.access_token
        this.expiry = response.expires_in
      })
    )
  }

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
        // if there are more than rows * cols songs, make a sub playlist

        return of(playlist)
      })
    )
  }

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
      tap((r) => console.log(r)),
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

  set clientSecret(secret: string) {
    this.userSession.client_secret = secret
    localStorage.setItem('userSession', JSON.stringify(this.userSession))
  }

  set expiry(expires_in: number) {
    this.userSession.expiry = Date.now() + expires_in
    localStorage.setItem('userSession', JSON.stringify(this.userSession))
  }

  set access_token(at: string) {
    this.userSession.access_token = at
    localStorage.setItem('userSession', JSON.stringify(this.userSession))
  }

  get clientID() {
    return this.userSession.client_id
  }

  get clientSecret() {
    return this.userSession.client_secret
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
