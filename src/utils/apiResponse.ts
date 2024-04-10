export class ApiResponse {
  statusCode: number;
  data: unknown | null;
  message: string;
  success: boolean

  constructor(statusCode: number, data: unknown, message = "Success") {
    this.statusCode = statusCode,
      this.data = data,
      this.message = message,
      this.success = this.statusCode < 400
  }
}
