export class CustomError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'CustomError';
  }

  static BadRequest(message: string): CustomError {
    return new CustomError(400, message);
  }

  static Unauthorized(message: string): CustomError {
    return new CustomError(401, message);
  }

  static Forbidden(message: string): CustomError {
    return new CustomError(403, message);
  }

  static NotFound(message: string): CustomError {
    return new CustomError(404, message);
  }

  static InternalServer(message: string): CustomError {
    return new CustomError(500, message);
  }
}
