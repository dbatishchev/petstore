import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import PetStoreError from '../../common/error/petStoreError';
import InvalidArgument from '../../common/error/invalidArgument';
import NotFound from '../../common/error/notFound';
import NoContent from '../../common/error/noContent';
import Conflict from '../../common/error/conflict';

@Catch(PetStoreError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: PetStoreError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;

    if (exception instanceof InvalidArgument) {
      status = 400;
    }
    if (exception instanceof NotFound) {
      status = 404;
    }
    if (exception instanceof NoContent) {
      status = 204;
    }
    if (exception instanceof Conflict) {
      status = 409;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
