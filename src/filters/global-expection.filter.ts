import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { getServerResponse } from '../utils/response.util';

@Catch()
export class GlobalExpectionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        let status: number;
        let message: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof QueryFailedError) {
            status = 400;
            message = 'Element already exist.';
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Something went wrong, try again later.';
        }
        
        console.error(exception);
        response.status(status).json(getServerResponse(message));
    }
}