import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../utils/custom-exceptions/validation.exception';
import { QueryFailedError } from 'typeorm';
import { getServerResponse } from '../utils/response.util';

@Catch()
export class GlobalExpectionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        let status: number;
        let message: string;
        let problems: string[] | null = null;

        if (exception instanceof BadRequestException) {
            const errorResponse = exception.getResponse();
            if (typeof errorResponse !== 'string') {
                const errorProblems = (errorResponse as any).message;
                if (typeof errorProblems === 'string') {
                    problems = [errorProblems];
                } else if (typeof errorProblems === 'object') {
                    problems = errorProblems;
                }
            }
            message = exception.message;
            status = exception.getStatus();
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof QueryFailedError) {
            status = 400;
            message = 'Element already exist.';
            problems = [];
        }  else if (exception instanceof ValidationException) {
            status = 400;
            message = exception.message;
            problems = exception.problems || [];
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Something went wrong, try again later.';
        }
        
        console.error(exception);
        response.status(status).json(getServerResponse(message, problems));
    }
}