export class Bingo {
  private rows = 5
  private cols = 5
  private cells: string[] = []

  constructor() {}

  populate(data: string[]) {
    this.cells = data
    console.log(data)
  }

  shuffle() {
    return this.cells
  }
}

export const BingoService = new Bingo()
