import { cleanEnv, str } from 'envalid';

export default cleanEnv(process.env, {
  JWT_SECRET: str({ devDefault: 'secret1' }),
});
