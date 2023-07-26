export function millisToMinutesAndSeconds(_milliseconds: number): string {
  const milliseconds = parseInt(_milliseconds as any, 10);
  if (
    typeof milliseconds !== 'number' ||
    isNaN(milliseconds) ||
    milliseconds < 0
  ) {
    throw new Error(
      'Invalid input. Please provide a non-negative number of milliseconds. parsed value = ' +
        milliseconds
    );
  }

  const seconds = Math.round(Math.floor(milliseconds / 1000));

  return secondsToMinutesAndSeconds(seconds);
}

export function secondsToMinutesAndSeconds(_seconds: number) {
  const seconds = parseInt(_seconds as any, 10);
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    throw new Error(
      'Invalid input. Please provide a non-negative number of seconds. parsed value = ' +
        seconds
    );
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}
