import { cleanEnv, port } from 'envalid';

export default cleanEnv(process.env, {
  // Microservices
  GATEWAY_SERVICE_PORT: port({ default: 3000 }),
  AUTH_SERVICE_PORT: port({ default: 49152 }),
});
