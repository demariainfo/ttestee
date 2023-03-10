import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get the status code and exceptionResponse
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? (exception.getResponse() as any) : 'Internal server error';

    // Get the message
    let message =
      typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message || exceptionResponse.error;

    // If the message is an string, parse it to array
    if (typeof message === 'string') message = [message];

    // Log the error
    this.logger.error(`[${status}] ${request.method} ${request.url} - ${JSON.stringify(message)}`, exception);

    // Send the response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
