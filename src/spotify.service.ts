import { from, map, mergeMap, tap } from 'rxjs'

export class Spotify {
  private url = 'https://api.spotify.com/v1/'
  private access_token?: string
  private client_id: string
  private client_secret: string

  constructor() {
    this.client_id = window.localStorage.getItem('clientID') ?? ''
    this.client_secret = window.localStorage.getItem('clientSecret') ?? ''
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
        console.log(response)
      })
    )
  }

  fetchPlaylist(id: string) {
    return this.api(`playlists/${id}`, {
      headers: {
        authorization: `Bearer ${this.access_token}`
      }
    }).pipe(
      map((playlist: SpotifyPlaylist) => {
        console.log(playlist)
        return playlist.tracks.items.map(
          (i) => `${i.track.name} - ${i.track.artists.map((a) => a.name).join(', ')}`
        )
      })
    )
  }

  private api(_url: string, init?: RequestInit) {
    const url = _url.startsWith('https://') ? _url : this.url + _url
    return from(fetch(url, init)).pipe(
      mergeMap((response) => response.text()),
      map((response) => JSON.parse(response))
    )
  }

  set clientID(id: string) {
    this.client_id = id
    window.localStorage.setItem('clientID', id)
  }

  set clientSecret(secret: string) {
    this.client_secret = secret
    window.localStorage.setItem('clientSecret', secret)
  }

  get clientID() {
    return this.client_id
  }

  get clientSecret() {
    return this.client_secret
  }

  get isLoggedIn() {
    return !!this.access_token
  }
}

export const SpotifyService = new Spotify()
