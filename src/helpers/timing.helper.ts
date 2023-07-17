export function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000);
  const seconds = (millis % 60000) / 1000;

  const fixedSeconds = seconds.toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + fixedSeconds;
}

export function secondsToMinutesAndSeconds(_seconds: any) {
  const seconds = parseInt(_seconds, 10);
  const minutes = Math.floor(seconds / 60);

  const fixedSeconds = seconds.toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + fixedSeconds;
}
