import { Notify } from 'quasar';
class Snack {
  msgInfo(title: string, message: string) {
    this.open('info', title, message);
  }
  msgWarn(title: string, message: string) {
    this.open('warning', title, message);
  }
  msgError(title: string, message: string) {
    this.open('negative', title, message);
  }

  msgSuccess(title: string, message: string) {
    this.open('positive', title, message);
  }

  private open(
    type: 'positive' | 'warning' | 'info' | 'negative',
    title: string,
    message: string
  ) {
    Notify.create({
      message: title,
      caption: message,
      type: type,
      timeout: 3000,
    });
  }
}

export const SnackbarService = new Snack();
