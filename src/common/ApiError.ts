export class ApiError extends Error {
  constructor(public status: number, public override message: string) {
    super()
  }

  static badRequest(message: string) {
    return new ApiError(400, message)
  }

  static forbidden(message: string) {
    return new ApiError(403, message)
  }

  static notFound(message: string) {
    return new ApiError(404, message)
  }
}
