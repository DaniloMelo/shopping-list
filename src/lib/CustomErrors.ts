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

export class PublicError extends Error {
  public action: string;

  constructor(message: string, action: string) {
    super(message);
    this.name = "PublicError";
    this.action = action;
  }
}
