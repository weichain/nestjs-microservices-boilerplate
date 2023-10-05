import concurrently from 'concurrently';
import { appDirectories, colors, onFailure, onSuccess } from './common.mjs';

const commands = appDirectories.map((a, index) => {
  return {
    command: `nest build ${a.name}`,
    name: a.name,
    env: { NODE_ENV: process.env.NODE_ENV },
    prefixColor: colors[index % (appDirectories.length - 1)],
  };
});

concurrently(commands).result.then(onSuccess, onFailure);
