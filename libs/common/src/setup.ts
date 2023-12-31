import { GlobalRpcExceptionFilter } from '@lib/filters';
import { useLogger } from '@lib/logger';
import { ServiceRegistry } from '@lib/service.registry';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Microservices } from './constants';
import { enableDevtools } from './devtools';

interface IMicroserviceSetupOptions {
  port: number;
  host?: string;
  retryAttempts?: number;
  retryDelay?: number; // ms
}

interface INestJsModule {
  name: string;
}

export async function microserviceSetup<M extends INestJsModule>(module: M, options?: IMicroserviceSetupOptions) {
  // sets the default options
  const { host = 'localhost', port, retryAttempts = 5, retryDelay = 250 } = options;

  enableDevtools();
  const app = await NestFactory.create(module, { snapshot: true });

  useLogger(app);

  const serviceRegistry = app.get(ServiceRegistry);
  await serviceRegistry.registerService(module.name, host, port);

  await app.init();

  app.useGlobalFilters(new GlobalRpcExceptionFilter());

  // enables graceful shutdown
  app.enableShutdownHooks();
  // sets the global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: false }));

  // creates a microservice instance
  const microservice = app.connectMicroservice(
    { transport: Transport.TCP, options: { host, port, retryAttempts, retryDelay } },
    { inheritAppConfig: true },
  );
  return { app: await app.startAllMicroservices(), microservice };
}

export function createClientProxy(service: Microservices, host: string, port: number) {
  return {
    provide: service,
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host, port },
      });
    },
  };
}
