export function millisToMinutesAndSeconds(milliseconds: number): string {
  if (
    typeof milliseconds !== 'number' ||
    isNaN(milliseconds) ||
    milliseconds < 0
  ) {
    throw new Error(
      'Invalid input. Please provide a non-negative number of milliseconds.'
    );
  }

  const seconds = Math.round(Math.floor(milliseconds / 1000));

  return secondsToMinutesAndSeconds(seconds);
}

export function secondsToMinutesAndSeconds(seconds: number) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    throw new Error(
      'Invalid input. Please provide a non-negative number of seconds.'
    );
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}
