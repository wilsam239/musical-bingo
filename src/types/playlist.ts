interface ExternalUrls {
  spotify: string
}

interface Followers {
  href: string
  total: number
}

interface Image {
  url: string
  height: number
  width: number
}

interface Owner {
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  type: string
  uri: string
  display_name: string
}

interface Album {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: { reason: string }
  type: string
  uri: string
  copyrights: { text: string; type: string }[]
  external_ids: { isrc: string; ean: string; upc: string }
  genres: string[]
  label: string
  popularity: number
  album_group: string
  artists: Artist[]
}

interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface Track {
  added_at: string
  added_by: {
    external_urls: ExternalUrls
    followers: Followers
    href: string
    id: string
    type: string
    uri: string
  }
  is_local: boolean
  track: {
    album: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: { isrc: string; ean: string; upc: string }
    external_urls: ExternalUrls
    href: string
    id: string
    is_playable: boolean
    linked_from: {}
    restrictions: { reason: string }
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
  }
}

interface SpotifyPlaylist {
  collaborative: boolean
  description: string
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  images: Image[]
  name: string
  owner: Owner
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: Track[]
  }
  type: string
  uri: string
}
