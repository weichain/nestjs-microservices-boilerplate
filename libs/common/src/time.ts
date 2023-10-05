import { DateTime } from 'luxon';

export function getCurrentTimestampInSeconds() {
  return Math.floor(DateTime.now().valueOf() / 1000);
}

export function getTimestampAfter(timestamp: number, minutes = 30) {
  return Math.floor(DateTime.fromSeconds(timestamp).plus({ minutes }).valueOf() / 1000);
}
