import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { getServerResponse } from '../utils/response.util';
import { multerStorageDir } from '../utils/storage.util';
import { FileItem } from './file.entity';

@Injectable()
export class FileService {
    async getFile(id: string, res: Response) {
        try {
            const file = await FileItem.findOne({
                where: {
                    id,
                }
            });
            if (!file) {
                throw new NotFoundException('No file found!');
            }

            res.sendFile(file.filename, {
                root: join(multerStorageDir()),
            });
        } catch (e) {
            res.status(500).json(getServerResponse('Something went wrong, try again later.'));
        }
    }
}
