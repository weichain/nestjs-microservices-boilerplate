import { Config } from '@lib/config';
import { name as APP_NAME, version as APP_VERSION } from '../../../package.json';

const INSTANCE_ID = Config.INSTANCE_ID;
const NODE_VERSION = process.version;
const OS_NAME = process.platform;
const HOST_NAME = process.pid;
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getServerLoadEvent = () => {
  return {
    event: 'server-load-event',
    properties: {
      instanceId: INSTANCE_ID,
      appName: APP_NAME,
      appVersion: APP_VERSION,
      nodeVersion: NODE_VERSION,
      osName: OS_NAME,
      hostName: HOST_NAME,
      timezone: TIMEZONE,
    },
    timestamp: new Date(),
  };
};
