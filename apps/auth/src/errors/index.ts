import { DatabaseRpcException } from '@lib/errors';

export class UserNotFound extends DatabaseRpcException {
  constructor() {
    super('User not found.');
  }
}

export class UserCreationFailure extends DatabaseRpcException {
  constructor() {
    super('User creation failed.');
  }
}

export class UserUpdateFailure extends DatabaseRpcException {
  constructor() {
    super('User update failed.');
  }
}

export class InvalidCredentials extends DatabaseRpcException {
  constructor() {
    super('Credentials not valid.');
  }
}
