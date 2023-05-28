class Snack {
  dialogs: HTMLDivElement[] = []
  root!: HTMLElement
  constructor() {
    const root = document.getElementById('snackbars')
    if (!root) {
      const r = document.createElement('div')
      r.id = 'snackbars'
      document.appendChild(r)
      this.root = r
    } else {
      this.root = root
    }
  }

  msgInfo(title: string, message: string) {
    this.open('info', title, message)
  }
  msgWarn(title: string, message: string) {
    this.open('warn', title, message)
  }
  msgError(title: string, message: string) {
    this.open('danger', title, message)
  }

  msgSuccess(title: string, message: string) {
    this.open('success', title, message)
  }

  private open(type: 'success' | 'warn' | 'info' | 'danger', title: string, message: string) {
    const snack = document.createElement(`div`)

    snack.className = `snackbar ${type}`
    snack.id = `snackbar-${this.dialogs.length}`

    const _title = document.createElement('h2')
    _title.textContent = title
    const _msg = document.createTextNode(message)

    snack.appendChild(_title)
    snack.append(_msg)

    this.root.appendChild(snack)

    this.dialogs.push(snack)

    setTimeout(() => {
      this.root.removeChild(snack)
    }, 3000)
  }
}

export const SnackbarService = new Snack()
