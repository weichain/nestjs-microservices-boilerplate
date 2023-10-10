import { cleanEnv, port } from 'envalid';

export default cleanEnv(process.env, {
  // Microservices
  GATEWAY_SERVICE_PORT: port({ default: 3000 }),

  USERS_SERVICE_PORT: port({ default: 49152 }),
  AUTH_SERVICE_PORT: port({ default: 49153 }),
  PATIENTS_SERVICE_PORT: port({ default: 49154 }),
});
