import { DEFAULT_SONG_LIMIT, SpotifyService } from './spotify.service';

const DEFAULT_SHEET_COUNT = 20;
export class Bingo {
  public readonly rows = 5;
  public readonly cols = 5;
  public subtitle: string | undefined;
  public customName: string | undefined;

  /** Original list of song names */
  private allCellData: string[] = [];
  private spotify = SpotifyService;

  public numberOfSheets = DEFAULT_SHEET_COUNT;
  private _winners?: { [key: number]: number[] } = {};

  private shuffledData: string[][] = [];

  private _playlistInfo!: SpotifyApi.PlaylistObjectFull;
  public songLimit = DEFAULT_SONG_LIMIT;

  populate(data: string[]) {
    this.allCellData = data;
    this.shuffledData = [];
    this._populate();
  }

  private _populate() {
    // Store the unique sheets
    const uniqueConfigs = new Set<string>();

    // Generate enough unique sheets as required
    while (uniqueConfigs.size < this.numberOfSheets) {
      // Shuffle the strings and get only enough to fill the sheet
      const shuffled = this.shuffle(this.allCellData).slice(
        0,
        this.rows * this.cols
      );

      const config = JSON.stringify(shuffled); // Convert the shuffled array to a string for set comparison

      if (!uniqueConfigs.has(config)) {
        uniqueConfigs.add(config);
        this.shuffledData.push(shuffled);
      }
    }

    // this.findWinners()
    // console.log(this._winners)
  }

  shuffle(strings: string[]) {
    const shuffledArray = strings.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }

  fetchTable(id: number) {
    if (id >= this.shuffledData.length) {
      console.error('Index is greater than the number of sheets');
      return [[]];
    }

    const data = this.shuffledData[id];
    const result: string[][] = [];
    let index = 0;

    for (let i = 0; i < this.rows; i++) {
      const row: string[] = [];

      for (let j = 0; j < this.cols; j++) {
        row.push(data[index]);
        index++;
      }

      result.push(row);
    }

    return result;
  }

  get isPopulated() {
    return this.allCellData.length > 0;
  }

  generate(p: SpotifyApi.PlaylistObjectFull, _songs: SpotifyApi.TrackObjectFull[]) {
    this._playlistInfo = p;
    if (this.numberOfSheets > 0) {
      const songs = _songs.map(
        (i) =>
          `${i.name} - ${i.artists.map((a) => a.name).join(', ')}`
      );
      if (songs.length < this.rows * this.cols) {
        console.error('Not enough songs in the playlist');
      } else {
        this.populate(songs);
      }
    }
  }

  get playlistURL() {
    return this._playlistInfo.external_urls.spotify;
  }
}

export const BingoService = new Bingo();
