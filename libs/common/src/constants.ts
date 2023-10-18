// Redis keys
export enum CacheKeys {}

// Swagger constants
export class SwaggerConstants {
  public static readonly DESCRIPTION = 'API Documentation';
  public static readonly TITLE = 'API';
  public static readonly TAG = 'API';
  public static readonly VERSION = '1.0';
  public static readonly PATH = 'api/docs';
}

// authorization prefix
export const USER_UUID_HEADER = 'x-user-uuid';
export const AUTHORIZATION_PREFIX = 'Bearer ';

export const TIMEOUT_DEFAULT = 60_000;

/**
 * custom cache headers
 */
export const X_MAX_AGE = 'x-max-age';

/**
 * API Cache prefix
 */
export const API_CACHE_KEY = 'opn:box:cache:';

/**
 * default value of the `max-age` property of the API cache, units are seconds
 */
export const DEFAULT_X_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export enum DefaultStatusMessage {
  OK_MSG = 'SUCCESS',
  SERVER_ERROR_MSG = 'SERVER_ERROR',
}

export enum Microservices {
  USERS = 'USERS',
  AUTH = 'AUTH',
}

export enum UsersMessagePatterns {}

export enum AuthMessagePatterns {
  REGISTER = 'register',
  LOGIN = 'login',
  UPDATE_PASSWORD = 'updatePassword',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}
