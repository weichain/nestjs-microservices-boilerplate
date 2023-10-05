import { Microservices, createClientProxy } from '@lib/common';
import { Config } from '@lib/config';

export const Clients = [createClientProxy(Microservices.AUTH, 'localhost', Config.AUTH_SERVICE_PORT)];
