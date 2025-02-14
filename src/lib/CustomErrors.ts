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
