import { cleanEnv, port, str } from 'envalid';

export default cleanEnv(process.env, {
  REDIS_PASSWORD: str({ default: '' }),
  REDIS_HOST: str({ default: 'localhost' }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_TLS: str({ default: '' }),
});
