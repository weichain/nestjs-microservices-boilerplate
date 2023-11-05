import { NestFactory } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { findFreePorts } from 'find-free-ports';
import { random } from 'lodash';
import 'reflect-metadata';

interface IDevtoolsOpts {
  port?: number;
  shouldEnable?: () => boolean;
  getFreePort?: () => Promise<number>;
}

interface INestJsModule {
  name: string;
}

function getImportedModules<M extends INestJsModule>(module: M) {
  return Reflect.getMetadata('imports', module) || [];
}

function importModuleInto<M extends INestJsModule>(targetModule: M, moduleToImport: M) {
  const currentModules = getImportedModules(targetModule);
  Reflect.defineMetadata('imports', [moduleToImport, ...currentModules], targetModule);
}

const getFreePort = async (): Promise<number> => {
  const result = await findFreePorts.findFreePorts(1, {
    /**
     * @dev Dynamic and/or private ports: 49152 to 65535; we use 49152 to 49252 for the microservices
     * @see https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
     * @dev this will **reduce** the number of ports to check and will **reduce** the collision probability
     * the issue when multiple services are started at the same time is that they can all try to use the same port
     * tl;dr we use random numbers to avoid conflicts between microservices
     */
    startPort: random(49252, 65534),
    endPort: 65535,
  });
  return result[0];
};

// create(module, options)
// create(module, httpAdapter, options)
const getOptionsIndex = (args: any[]) => (args.length === 3 ? 2 : 1);

/**
 * Enable devtools integration in a NestJS application.
 * @param options Options to configure the devtools integration.
 * @param options.port The port to use for the devtools server. If not provided, a random port will be used.
 * @param options.shouldEnable A function that returns a boolean to determine if the devtools should be enabled.
 * If not provided, the devtools will be enabled only in development mode.
 * @param options.getFreePort A function that returns a promise of a free port to use for the devtools server.
 * If not provided, a random port will be used.
 */
export function enableDevtools(options?: IDevtoolsOpts) {
  // use shouldEnable with priority over NODE_ENV
  // if shouldEnable is not defined, use NODE_ENV === 'development'
  const shouldEnable = options?.shouldEnable ? options.shouldEnable() : process.env.NODE_ENV === 'development';

  const originalCreateMethod = NestFactory.create;

  if (shouldEnable) {
    try {
      NestFactory.create = async function create(...args: any[]) {
        const getFreePortFn = options?.getFreePort ?? getFreePort;

        const port: number = options?.port ?? (await getFreePortFn());

        const optionsIndex = getOptionsIndex(args);

        const mergeOptions = { snapshot: true };
        args[optionsIndex] = Object.assign(args[optionsIndex] || {}, mergeOptions);

        const rootModule = args[0];

        if (typeof rootModule === 'function') {
          const importedModules = getImportedModules(rootModule);
          const alreadyRegistered = importedModules.some((module) => {
            if (typeof module === 'object' && 'module' in module) {
              return module.module === DevtoolsModule;
            }
            return false;
          });

          if (alreadyRegistered) {
            // eslint-disable-next-line no-console
            console.log('Devtools already registered');
          } else {
            // eslint-disable-next-line no-console
            console.log(`Importing \`DevtoolsModule on port ${port}\` into module \`${rootModule.name}\``);
            importModuleInto(rootModule, DevtoolsModule.register({ port, http: true }));
          }
        }

        return originalCreateMethod.apply(this, args);
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}
