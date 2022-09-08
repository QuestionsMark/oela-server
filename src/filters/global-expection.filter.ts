import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { getServerResponse } from '../utils/response.util';

@Catch()
export class GlobalExpectionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.message : 'Something went wrong, try again later.';
        
        console.error(exception);
        response.json(getServerResponse(status, message));
    }
}