import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config({ path: `${process.cwd()}/env/${process.env.NODE_ENV}.env` });
}

import CommonConfig from './common.config';
import DatabaseConfig from './database.config';
import PortsConfig from './ports.config';
import RedisConfig from './redis.config';
import Secrets from './secrets.config';

export const Config = {
  ...CommonConfig,
  ...DatabaseConfig,
  ...PortsConfig,
  ...Secrets,
  ...RedisConfig,
};
