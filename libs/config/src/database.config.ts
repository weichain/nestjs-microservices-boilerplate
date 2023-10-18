import { cleanEnv, str } from 'envalid';

export default cleanEnv(process.env, {
  MAIN_DATABASE_URI: str({
    devDefault: 'mongodb://root:root@localhost:27018/localdb?authSource=admin',
  }),

  MAIN_DB_CLOAK_MASTER_KEY: str({
    devDefault: 'k1.aesgcm256.52-8xBOeASS3_strDZ13mjqOcIAVnB58Lia3iLjUK9A=',
  }),
  MAIN_DB_CLOAK_KEYCHAIN: str({
    devDefault: 'v1.aesgcm256.34ebee1f.uxOzuwqZYwG9B7EE.VDA6Nypgs8ynn7OixI5cQT_c',
  }),
});
