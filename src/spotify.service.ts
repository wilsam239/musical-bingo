import { from, map, mergeMap, tap } from 'rxjs'

export class Spotify {
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

  get isLoggedIn() {
    return (
      !!this.userSession.access_token &&
      !!this.userSession.expiry &&
      this.userSession.expiry > Date.now()
    )
  }
}

export const SpotifyService = new Spotify()
