import concurrently from 'concurrently';
import { appDirectories, colors, onFailure, onSuccess } from './common.mjs';

export const ignored = [];

const commands = appDirectories
  .filter((d) => !ignored.includes(d.name))
  .map((a, index) => {
    return {
      command:
        process.env.NODE_ENV === 'development' ? `pnpm nest start ${a.name} --watch` : `node ${process.cwd()}/dist/apps/${a.name}/main.js`,
      name: a.name,
      env: { NODE_ENV: process.env.NODE_ENV },
      prefixColor: colors[index % (appDirectories.length - 1)],
    };
  });

concurrently(commands).result.then(onSuccess, onFailure);
