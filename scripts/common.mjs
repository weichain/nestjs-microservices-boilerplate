import { readdirSync } from 'fs';

export const colors = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
];

export function onSuccess() {
  console.info(`Running concurrently succeeded`);
}

export function onFailure() {
  console.error(`Running concurrently failed`);
}

export const ignored = [];

export const appDirectories = readdirSync(`${process.cwd()}/apps`, {
  withFileTypes: true,
}).filter((dirent) => {
  return dirent.isDirectory() && !ignored.includes(dirent.name);
});
