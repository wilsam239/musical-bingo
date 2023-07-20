import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';
import { SnackbarService } from './snackbar.service';
export const DEFAULT_SONG_LIMIT = 25;
export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}
interface PlaylistOptions {
  playlistSize?: number;
  subtitle?: string;
  customName?: string;
}

export interface PlayedSong {
  song: SpotifyApi.TrackObjectFull;
  timePlayed: number;
}

const SCOPE = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
];

class ACTIONS {
  static FETCH_PLAYLISTS = 'fetch_playlists';
  static FETCH_TRACKS = 'fetch_tracks';
}
interface BingoSession {
  client_id: string;
  access_token?: string;
  refresh_token?: string;
  expiry?: number;
  user?: SpotifyApi.UserObjectPrivate;
}
class Spotify {
  private snack = SnackbarService;
  private url = 'https://api.spotify.com/v1/';
  private userSession: BingoSession;

  sessionPlaylists: SpotifyApi.PlaylistObjectFull[] = [];
  private sessionPlayed: PlayedSong[] = [];
  storeSessionPlayed = new BehaviorSubject<PlayedSong[]>([]);

  loadingState = new BehaviorSubject(true);

  readonly createdPlaylist = new BehaviorSubject<
    SpotifyApi.PlaylistObjectFull | undefined
  >(undefined);

  readonly timer = new BehaviorSubject(0);

  readonly currentPlaybackState = new BehaviorSubject<
    SpotifyApi.CurrentPlaybackResponse | undefined
  >(undefined);

  private actions: Set<string> = new Set();
  constructor() {
    const autoRefresh = () => {
      if (this.userSession.refresh_token) {
        console.log('Triggering auto token refresh');
        this.refreshToken().subscribe();
      }
    };
    this.sessionPlaylists = JSON.parse(
      sessionStorage.getItem('playlists') ?? '[]'
    );
    this.sessionPlayed = JSON.parse(sessionStorage.getItem('played') ?? '[]');
    this.storeSessionPlayed.next(this.sessionPlayed);
    this.userSession = JSON.parse(
      localStorage.getItem('userSession') ??
        JSON.stringify({
          client_id: '',
        })
    );

    // autoRefresh();

    setInterval(() => {
      autoRefresh();
    }, this.minutesToMilliseconds(20));

    setInterval(() => {
      if (this.isLoggedIn) {
        this.fetchPlaybackState().subscribe();
      }
    }, 5000);
  }

  minutesToMilliseconds(mins: number) {
    return mins * 60 * 1000;
  }

  clearSession() {
    this.userSession = {
      client_id: this.clientID,
    };

    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  }

  /**
   * Taken from the api docs
   * https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
   * @param length
   */
  private generateCodeVerifier(length: number) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Taken from the api docs
   * https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
   */
  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Go to the spotify oauth page to get an exchange code
   */
  async loginNoCode() {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem('verifier', verifier);
    const params = new URLSearchParams();
    params.append('client_id', this.clientID);
    params.append('response_type', 'code');
    params.append(
      'redirect_uri',
      `${location.protocol}//${location.host}/musical-bingo/login`
    );
    params.append('scope', SCOPE.join(' '));
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * After coming back from spotify oauth page, call the api to login now that we have an exchange code
   * @param code Exchange code from spotify api
   * @returns
   */
  loginWithCode(code: string) {
    const verifier = localStorage.getItem('verifier');
    const params = new URLSearchParams();
    params.append('client_id', this.clientID);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append(
      'redirect_uri',
      `${location.protocol}//${location.host}/musical-bingo/login`
    );
    params.append('code_verifier', verifier!);

    return this.api('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }).pipe(
      tap((response: TokenResponse) => {
        this.postLogin(response);
      }),
      mergeMap(() => this.fetchMe())
    );
  }

  /**
   * Get the users info from the /me endpoint
   */
  fetchMe() {
    return this.api('me').pipe(
      tap((me) => {
        this.me = me;
      })
    );
  }

  fetchPlaylists() {
    this.actions.add(ACTIONS.FETCH_PLAYLISTS);
    const items: SpotifyApi.PlaylistObjectSimplified[] = [];
    const getNext = (u = `users/${this.me!.id}/playlists`): Observable<any> => {
      return this.api(u).pipe(
        mergeMap((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {
          items.push(...response.items);
          return response.next ? getNext(response.next) : of(response);
        })
      );
    };

    return getNext().pipe(
      tap(() => {
        this.actions.delete(ACTIONS.FETCH_PLAYLISTS);
      }),
      map(() => {
        return items;
      })
    );
  }

  /**
   * Fetch a spotify playlist, and if necessary, make a subplaylist out of it so that we can use it for bingo
   * @param id Id of the spotify playlist
   * @returns
   */
  fetchPlaylist(id: string): Observable<SpotifyApi.PlaylistObjectFull> {
    return this.api(`playlists/${id}`).pipe(
      tap((playlist) => {
        const fixString = (inputString: string) => {
          let fixedString = inputString;
          let hasReplacements = true;

          while (hasReplacements) {
            const previousString = fixedString;
            fixedString = fixedString
              .replace(/&#x2F;/g, '/')
              .replace(/&#x3A;/g, ':');

            hasReplacements = fixedString !== previousString;
          }

          return fixedString;
        };

        if (playlist.description) {
          playlist.description = fixString(playlist.description);
        }
      })
    );
  }

  fetchPlaylistTracks(playlist: SpotifyApi.PlaylistObjectFull) {
    this.actions.add(ACTIONS.FETCH_TRACKS);
    const getTracks = (items: SpotifyApi.PlaylistTrackObject[]) => {
      return items.filter((i) => i.track).map((i) => i.track!);
    };
    const items: SpotifyApi.TrackObjectFull[] = getTracks(
      playlist.tracks.items
    );
    const getNext = (u = playlist.tracks.next): Observable<any> => {
      if (u) {
        return this.api(u).pipe(
          mergeMap((response: SpotifyApi.PlaylistTrackResponse) => {
            items.push(...getTracks(response.items));
            return response.next ? getNext(response.next) : of(response);
          })
        );
      } else {
        return of('');
      }
    };

    return getNext().pipe(
      tap(() => {
        this.actions.delete(ACTIONS.FETCH_TRACKS);
      }),
      map(() => {
        return items;
      })
    );
  }

  fetchPlaybackState(): Observable<SpotifyApi.CurrentPlaybackResponse> {
    return this.api('me/player').pipe(
      tap((resp) => {
        if (resp && resp.item && resp.item.type == 'track') {
          this.currentPlaybackState.next(resp);
          // console.log(state)
        }
      })
    );
  }

  fetchQueue(): Observable<SpotifyApi.UsersQueueResponse> {
    return this.api('me/player/queue');
  }

  addToQueue(track: SpotifyApi.TrackObjectFull) {
    const params = new URLSearchParams();
    params.append('uri', track.uri);
    return this.api(`me/player/queue?uri=${track.uri}`, {
      method: 'POST',
    });
  }

  scrubToSeconds(seconds: number) {
    return this.api(`me/player/seek?position_ms=${seconds * 1000}`, {
      method: 'PUT',
    });
    // TODO Implement this
    return of(true);
  }

  nextTrack() {
    return this.api('me/player/next', {
      method: 'POST',
    });
  }

  pause() {
    return this.api('me/player/pause', {
      method: 'PUT',
    });
  }

  /**
   * Shuffle the track list around so that we get a unique set of songs that aren't in order
   * @param songs
   * @returns
   */
  private shuffle(songs: SpotifyApi.TrackObjectFull[]) {
    const shuffledArray = songs.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }

  /**
   * Generate a bingo playlist of fixed length
   * @param p The original playlist
   * @param length The length of the new one
   * @returns
   */
  makeSubPlaylist(
    p: SpotifyApi.PlaylistObjectFull,
    options: PlaylistOptions
  ): Observable<SpotifyApi.PlaylistObjectFull> {
    const length = options.playlistSize ?? DEFAULT_SONG_LIMIT;
    if (length > p.tracks.total) {
      return throwError(() => {
        return {
          title: 'Not enough tracks',
          message: `Cannot make a playlist that has ${length} tracks, when the original playlist doesn't have that many songs`,
        };
      });
    }

    // Construct the body
    const today = new Date(Date.now());
    const body = {
      name:
        options.customName ??
        `Musical Bingo - ${today.toLocaleDateString()} - ${
          options.subtitle ?? p.name
        }`,
      description: `Auto generated bingo for ${today.toLocaleDateString()}. Generated from Playlist ${
        p.name
      } (${p.external_urls.spotify}).`,
      public: false,
    };
    let startingObs = of(true);

    if (!this.me) {
      startingObs = this.fetchMe();
    }

    let songSelection: SpotifyApi.TrackObjectFull[] = [];

    // Create a new playlist
    return startingObs.pipe(
      mergeMap(() => this.fetchPlaylistTracks(p)),
      tap((songs) => {
        const similarityCheck = false;
        let filtered_songs: SpotifyApi.TrackObjectFull[] = songs;
        if (similarityCheck) {
          //TODO - Actually make this work
          // Gets the songs already used this session
          const alreadyUsedSongs = this.sessionPlaylists.flatMap((p) =>
            p.tracks.items.flatMap((t) => t.track?.id)
          );

          // Get the song selection
          filtered_songs = songs.filter(
            (song) => !alreadyUsedSongs.includes(song.id)
          );

          // Throw an error if the playlists are too similar
          if (filtered_songs.length < length) {
            return throwError(() => {
              return {
                title: 'Playlists are too similar',
                message: `Cannot generate ${length} uniqe songs that haven't already been generated this session.`,
              };
            });
          }
        }

        songSelection = this.shuffle(filtered_songs).slice(0, length);
      }),
      mergeMap(() =>
        this.api(`users/${this.me!.id}/playlists`, {
          method: 'POST',
          body: JSON.stringify(body),
        }).pipe(
          mergeMap((newPlaylist: SpotifyApi.PlaylistObjectFull) => {
            const tracksBody = {
              position: 0,
              uris: songSelection.map((t) => t.uri),
            };
            // Add the songs to the new playlist
            return this.api(`playlists/${newPlaylist.id}/tracks`, {
              method: 'POST',
              body: JSON.stringify(tracksBody),
            }).pipe(
              mergeMap(() => {
                return this.fetchPlaylist(newPlaylist.id).pipe(
                  tap((p) => {
                    this.sessionPlaylists.push(p);
                    sessionStorage.setItem(
                      'playlists',
                      JSON.stringify(this.sessionPlaylists)
                    );
                  })
                );
              })
            );
          })
        )
      )
    );
  }

  /**
   * The api call that is made to spotify with fetch requests and converted to rxjs
   * @param _url URL to go to, can be just a subsection eg: /playlists or can be a whole url
   *
   * If a subssection, it will be prepended with the spotify api url
   * @param init The request headers, body, and auth
   * @returns
   */
  private api(_url: string, init?: RequestInit, forceNoAuth = false) {
    const url = _url.startsWith('https://') ? _url : this.url + _url;

    let updatedInit: { [key: string]: any } = init ?? ({} as any);
    const headers = updatedInit.headers ?? {};
    if (
      (!init || !headers.authorization) &&
      this.access_token &&
      !forceNoAuth
    ) {
      updatedInit = {
        ...updatedInit,
        headers: {
          ...headers,
          authorization: `Bearer ${this.access_token}`,
        },
      };
    }
    return from(fetch(url, updatedInit)).pipe(
      mergeMap((response) => {
        return from(response.text()).pipe(
          mergeMap((body) => {
            if (response.status < 400) {
              return of(body);
            } else {
              return throwError(() => JSON.parse(body));
            }
          }),
          map((body) => {
            if (body.length > 0) {
              return JSON.parse(body);
            } else {
              return { items: [] };
            }
          })
        );
      }),
      catchError((err) => {
        if (err) {
          console.error(err);
          this.snack.msgError('API Error', err.message);
        }
        if (!err) {
          return of(err);
        }
        return throwError(() => err);
      })
    );
  }

  logout() {
    this.userSession.access_token = undefined;
    this.userSession.refresh_token = undefined;
    this.userSession.expiry = undefined;
    this.userSession.user = undefined;
  }

  refreshToken() {
    console.log('Refreshing token');
    const params = new URLSearchParams();
    params.append('client_id', this.clientID);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.refresh_token);

    return this.api(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
      true
    ).pipe(
      tap((response: TokenResponse) => {
        console.log('Token refreshed!');
        this.postLogin(response);
      }),
      mergeMap(() => this.fetchMe()),
      catchError((e) => {
        if (e.error_description == 'Refresh token revoked') {
          this.refresh_token = '';
        }
        return of(e);
      })
    );
  }

  /**
   * Actions after login and a successful token response has been returned
   * @param response
   */
  private postLogin(response: TokenResponse) {
    this.access_token = response.access_token;
    this.refresh_token = response.refresh_token;
    this.expiry = response.expires_in;
  }

  get me() {
    return this.userSession.user ?? undefined;
  }

  set me(u: SpotifyApi.UserObjectPrivate | undefined) {
    this.userSession.user = u;
    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  }

  get clientID() {
    return this.userSession.client_id;
  }

  set clientID(id: string) {
    this.userSession.client_id = id;
    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  }

  get expiry() {
    return this.userSession.expiry ?? 0;
  }
  set expiry(expires_in: number) {
    this.userSession.expiry = Date.now() + expires_in * 1000;
    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  }

  set access_token(at: string) {
    this.userSession.access_token = at;
    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  }
  get access_token() {
    return this.userSession.access_token ?? '';
  }

  set refresh_token(at: string) {
    this.userSession.refresh_token = at;
    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  }

  get refresh_token() {
    return this.userSession.refresh_token ?? '';
  }

  get isLoggedIn() {
    const loggedIn =
      !!this.userSession.access_token &&
      !!this.userSession.expiry &&
      this.userSession.expiry > Date.now();

    if (!loggedIn && !!this.access_token) {
      this.access_token = '';
    }

    return loggedIn;
  }

  addSongToPlayed(song: SpotifyApi.TrackObjectFull) {
    const lastSong = this.sessionPlayed.at(0);
    const playedSong: PlayedSong = {
      song: song,
      timePlayed: Date.now(),
    };
    if (!lastSong || lastSong.song.id !== song.id) {
      console.info(`Added ${song.name} to the recently played songs`);
      this.sessionPlayed.unshift(playedSong);
      this.storeSessionPlayed.next(this.sessionPlayed);
      window.sessionStorage.setItem(
        'played',
        JSON.stringify(this.sessionPlayed)
      );
    }
  }

  get loading() {
    return this.loadingState.getValue();
  }

  set loading(v: boolean) {
    if (this.actions.size === 0 || v) {
      this.loadingState.next(v);
    } else {
      console.log('Still stuff loading, hold your horses');
    }
  }
}

export const SpotifyService = new Spotify();
