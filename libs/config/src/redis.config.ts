import { cleanEnv, json, port, str } from 'envalid';

export default cleanEnv(process.env, {
  REDIS_PASSWORD: str({ devDefault: 'root' }),
  REDIS_USERNAME: str({ devDefault: 'default' }),
  REDIS_HOST: str({ devDefault: 'localhost' }),
  REDIS_PORT: port({ devDefault: 6379 }),
  REDIS_TLS: json({ devDefault: undefined }),
});
