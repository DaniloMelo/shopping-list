class CustomError extends Error {
  public readonly action: string;
  public readonly statusCode: number;
  public readonly isPublicError: boolean;

  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, { cause: cause });
    this.action = action;
    this.statusCode = statusCode;
    this.isPublicError = isPublicError;
  }
}

export class UserValidationsError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "UserValidationsError2";
  }
}

export class ProductValidationsError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "ProductValidationsError";
  }
}

export class ModelValidationError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "ModelValidationError";
  }
}

export class RegisterServiceError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "RegisterServiceError";
  }
}

export class LoginServiceError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "LoginServiceError";
  }
}

export class LogoutServiceError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "LogoutServiceError";
  }
}

export class UserServiceError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "UserServiceError";
  }
}

export class ResetPasswordServiceError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "ResetPasswordServiceError";
  }
}

export class TokenServiceError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "TokenServiceError";
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, action: string, statusCode: number, isPublicError: boolean, cause?: unknown) {
    super(message, action, statusCode, isPublicError, cause);
    this.name = "InternalServerError";
  }
}

export class MethodNotAllowedError extends Error {
  statusCode: number;

  constructor(message = "Method Not Allowed.", statusCode = 405) {
    super(message);
    this.statusCode = statusCode;
    this.name = "MethodNotAllowedError";
  }
}

export class PublicError extends Error {
  public action: string;

  constructor(message: string, action: string) {
    super(message);
    this.name = "PublicError";
    this.action = action;
  }
}
