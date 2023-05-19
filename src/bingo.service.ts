export class Bingo {
  public rows = 5
  public cols = 5
  /** Original list */
  private cells: string[] = []
  public numberOfSheets = 20

  private shuffledData: string[][] = []

  constructor() {
    this.populate([
      'Last Night - Morgan Wallen',
      'Daylight - David Kushner',
      'Flowers - Miley Cyrus',
      "Boy's a Liar Pt. 2 - PinkPantheress, Ice Spice",
      'Cupid - Twin Ver. - FIFTY FIFTY',
      'Kill Bill - SZA',
      'Fast Car - Luke Combs',
      'As It Was - Harry Styles',
      "Creepin' (with The Weeknd & 21 Savage) - Metro Boomin, The Weeknd, 21 Savage",
      'MATHEMATICAL DISRESPECT - Lil Mabu',
      'Anti-Hero - Taylor Swift',
      "I Ain't Worried - OneRepublic",
      'All My Life (feat. J. Cole) - Lil Durk, J. Cole',
      'Something in the Orange - Zach Bryan',
      'Players - Coi Leray',
      'See You Again (feat. Kali Uchis) - Tyler, The Creator, Kali Uchis',
      'Miracle (with Ellie Goulding) - Calvin Harris, Ellie Goulding',
      'Escapism. - RAYE, 070 Shake',
      'Eyes Closed - Ed Sheeran',
      'Until I Found You (with Em Beihold) - Em Beihold Version - Stephen Sanchez, Em Beihold',
      'Riptide - Vance Joy',
      'You Proof - Morgan Wallen',
      'Chemical - Post Malone',
      'No Role Modelz - J. Cole',
      'Die For You (with Ariana Grande) - Remix - The Weeknd, Ariana Grande',
      'ceilings - Lizzy McAlpine',
      'Never Felt So Alone - Labrinth',
      'Area Codes - Kali',
      'Unholy (feat. Kim Petras) - Sam Smith, Kim Petras',
      'Shivers - Ed Sheeran',
      'Snooze - SZA',
      'The Kind of Love We Make - Luke Combs',
      'Calm Down (with Selena Gomez) - Rema, Selena Gomez',
      'Die For You - The Weeknd',
      "I'm Good (Blue) - David Guetta, Bebe Rexha",
      'Sure Thing - Miguel',
      '10:35 - Tiësto, Tate McRae',
      'Someone You Loved - Lewis Capaldi',
      'Mr. Brightside - The Killers',
      'Wish You The Best - Lewis Capaldi',
      'Yellow - Coldplay',
      'Viva La Vida - Coldplay',
      'golden hour - JVKE',
      'Cruel Summer - Taylor Swift',
      'Another Love - Tom Odell',
      'Money Trees - Kendrick Lamar, Jay Rock',
      'Green Green Grass - George Ezra',
      'People - Libianca',
      'The Color Violet - Tory Lanez',
      'Rhyme Dust - MK, Dom Dolla'
    ])
  }

  populate(data: string[]) {
    this.cells = data.slice(0, this.cols * this.rows)

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
    const result: string[][] = []
    let index = 0

    for (let i = 0; i < this.rows; i++) {
      const row: string[] = []

      for (let j = 0; j < this.cols; j++) {
        row.push(this.cells[index])
        index++
      }

      result.push(row)
    }

    return result
  }

  get isPopulated() {
    return this.cells.length > 0
  }
}

export const BingoService = new Bingo()
