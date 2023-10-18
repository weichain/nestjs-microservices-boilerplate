import { bool, cleanEnv, str } from 'envalid';
import { v4 as uuidv4 } from 'uuid';

export default cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),

  INSTANCE_ID: str({ default: uuidv4() }),

  API_CACHE_ENABLED: bool({ default: false }),
});
