import { bool, cleanEnv, num, str } from 'envalid';
import { v4 as uuidv4 } from 'uuid';

export default cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),

  INSTANCE_ID: str({ default: uuidv4() }),

  API_CACHE_ENABLED: bool({ default: false }),

  API_RATE_LIMITTER_TTL: num({ default: 60 }),
  API_RATE_LIMITTER_LIMIT: num({ default: 60 }),
});
