import { cleanEnv, port, str } from 'envalid';

export default cleanEnv(process.env, {
  REDIS_PASSWORD: str({ devDefault: '' }),
  REDIS_HOST: str({ devDefault: 'localhost' }),
  REDIS_PORT: port({ devDefault: 6379 }),
  REDIS_TLS: str({ devDefault: '' }),
});
