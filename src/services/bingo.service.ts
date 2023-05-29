import { SpotifyService } from './spotify.service'

export class Bingo {
  public rows = 5
  public cols = 5
  public subtitle: string | undefined
  /** Original list */
  private cells: string[] = []
  private spotify = SpotifyService

  public numberOfSheets = 20
  private _winners?: { [key: number]: number[] } = {}

  private shuffledData: string[][] = []
  public hasTooManySongs = false

  private _playlistInfo!: SpotifyPlaylist

  constructor() {}

  populate(data: string[]) {
    // We need to make sure we only take the number of songs that can be in the bingo board
    // Otherwise there might not ever be a winner
    this.cells = data.slice(0, this.cols * this.rows)

    if (data.length > this.cols * this.rows) {
      this.hasTooManySongs = true
      // Make a snippet from the playlist eventually
    }

    this._populate()
  }

  private _populate() {
    // Store the unique sheets
    const uniqueConfigs = new Set<string>()

    // Generate enough unique sheets as required
    while (uniqueConfigs.size < this.numberOfSheets) {
      // Shuffle the strings
      const shuffled = this.shuffle(this.cells)
      const config = JSON.stringify(shuffled) // Convert the shuffled array to a string for set comparison

      if (!uniqueConfigs.has(config)) {
        uniqueConfigs.add(config)
        this.shuffledData.push(shuffled)
      }
    }

    // this.findWinners()
    // console.log(this._winners)
  }

  private findWinners() {
    const sheetPlaces: { [key: number]: number[] } = {}
    const sheetsToCheck = [...this.shuffledData]
    const calledSongs: string[] = []
    for (const song of this.cells) {
      calledSongs.push(song)
      const winnersThisRound: number[] = []

      sheetsToCheck.forEach((sheet, i) => {
        if (
          Object.values(sheetPlaces)
            .flat()
            .includes(i + 1)
        ) {
          return
        }
        let hasWinner = false
        for (const row of this.extractRows(sheet)) {
          if (row.every((song) => calledSongs.includes(song))) {
            hasWinner = true
            break
          }
        }

        if (!hasWinner) {
          for (const col of this.extractColumns(sheet)) {
            if (col.every((song) => calledSongs.includes(song))) {
              hasWinner = true
              break
            }
          }

          if (!hasWinner) {
            for (const dia of this.extractDiagonals(sheet)) {
              if (dia.every((song) => calledSongs.includes(song))) {
                hasWinner = true
                break
              }
            }
          }
        }

        if (hasWinner) {
          winnersThisRound.push(i + 1)
        }
      })

      if (winnersThisRound.length > 0) {
        const place = Object.keys(sheetPlaces).length + 1

        sheetPlaces[place] = winnersThisRound
      }
    }

    this._winners = sheetPlaces
  }

  private extractDiagonals(d: string[]) {
    const size = d.length
    const diagonalLtR: string[] = []
    const diagonalRtL: string[] = []

    // Check if the array is square (number of elements is a perfect square)
    if (Math.sqrt(size) % 1 !== 0) {
      return [diagonalLtR, diagonalRtL]
    }

    const dimension = Math.sqrt(size)

    // Retrieve elements on the diagonal from left to right
    for (let i = 0; i < size; i += dimension + 1) {
      diagonalLtR.push(d[i])
    }

    // Retrieve elements on the diagonal from right to left
    for (let i = dimension - 1; i < size - 1; i += dimension - 1) {
      diagonalRtL.push(d[i])
    }

    return [diagonalLtR, diagonalRtL]
  }

  private extractRows(d: string[]) {
    const rows = []
    for (let i = 0; i <= this.rows; i++) {
      rows.push(this.extractRow(d, i))
    }
    return rows.slice(1, this.rows + 1)
  }

  private extractRow(d: string[], row: number) {
    return d.slice((row - 1) * this.rows, this.cols * row)
  }

  private extractColumns(d: string[]) {
    const columns = []

    for (let i = 0; i < this.cols; i++) {
      columns.push(this.extractColumn(d, i))
    }

    return columns
  }

  private extractColumn(d: string[], col: number) {
    return [
      d[col],
      d[col + this.cols],
      d[col + this.cols * 2],
      d[col + this.cols * 3],
      d[col + this.cols * 4]
    ]
  }

  shuffle(strings: string[]) {
    const shuffledArray = strings.slice()

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
    }

    return shuffledArray
  }

  fetchTable(id: number) {
    if (id >= this.shuffledData.length) {
      console.error('Index is greater than the number of sheets')
      return [[]]
    }

    const data = this.shuffledData[id]
    const result: string[][] = []
    let index = 0

    for (let i = 0; i < this.rows; i++) {
      const row: string[] = []

      for (let j = 0; j < this.cols; j++) {
        row.push(data[index])
        index++
      }

      result.push(row)
    }

    return result
  }

  get isPopulated() {
    return this.cells.length > 0
  }

  get winners() {
    if (this._winners) {
      return Object.values(this._winners)
    }
    return []
  }

  set playlistInfo(p: SpotifyPlaylist) {
    this._playlistInfo = p
    const songs = p.tracks.items.map(
      (i) => `${i.track.name} - ${i.track.artists.map((a) => a.name).join(', ')}`
    )
    if (songs.length < this.rows * this.cols) {
      console.error('Not enough songs in the playlist')
    } else {
      this.populate(songs)
    }
  }

  get playlistURL() {
    return this._playlistInfo.external_urls.spotify
  }
}

export const BingoService = new Bingo()
