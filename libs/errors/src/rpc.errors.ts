import { RpcException } from '@nestjs/microservices';

export enum RpcExceptionStatus {
  NOT_FOUND_EXCEPTION,
  BAD_REQUEST_EXCEPTION,
  UNSUPPORTED_MEDIATYPE_EXCEPTION,
  VALIDATION_EXCEPTION,
  PAYLOAD_TOO_LARGE_EXCEPTION,
  NOT_IMPLEMENTED_EXCEPTION,
  UNAUTHORIZED_EXCEPTION,
  REQUEST_TIMEOUT_EXCEPTION,
  METHOD_NOT_ALLOWED_EXCEPTION,
  FORBIDDEN_EXCEPTION,
  CONFLICT_EXCEPTION,
  DATABASE_EXCEPTION,
  INVALID_INPUT,
}

export class NotFoundRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.NOT_FOUND_EXCEPTION });
  }
}

export class BadRequestRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.BAD_REQUEST_EXCEPTION });
  }
}

export class UnsupportedMediaTypeRpcException extends RpcException {
  constructor(message: string) {
    super({
      message,
      code: RpcExceptionStatus.UNSUPPORTED_MEDIATYPE_EXCEPTION,
    });
  }
}

export class ForbiddenRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.FORBIDDEN_EXCEPTION });
  }
}

export class ConflictRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.CONFLICT_EXCEPTION });
  }
}

export class MethodNotAllowedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.METHOD_NOT_ALLOWED_EXCEPTION });
  }
}

export class RequestTimeoutRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.REQUEST_TIMEOUT_EXCEPTION });
  }
}

export class UnauthorizedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.UNAUTHORIZED_EXCEPTION });
  }
}

export class NotImplementedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.NOT_IMPLEMENTED_EXCEPTION });
  }
}

export class PayloadTooLargeRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.PAYLOAD_TOO_LARGE_EXCEPTION });
  }
}

export class ValidationRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.VALIDATION_EXCEPTION });
  }
}

export class DatabaseRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.DATABASE_EXCEPTION });
  }
}

export class InvalidInputRpcException extends RpcException {
  constructor(message: string) {
    super({ message, code: RpcExceptionStatus.INVALID_INPUT });
  }
}
