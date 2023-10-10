import { Microservices, createClientProxy } from '@lib/common';
import { Config } from '@lib/config';

// TODO: fetch all microservices from the microservice registry to avoid hardcoding
export const Clients = [
  createClientProxy(Microservices.AUTH, 'localhost', Config.AUTH_SERVICE_PORT),
  createClientProxy(Microservices.PATIENTS, 'localhost', Config.PATIENTS_SERVICE_PORT),
];
