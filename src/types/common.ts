export interface MulterFile {
    filename: string;
    size: number;
    mimetype: string;
    originalname: string;
    fieldname: string;
    encoding: string;
}

export interface MulterDiskUploadedFiles {
    [fieldname: string]: MulterFile[] | undefined;
}

export enum FileDir {
    Anime = 'anime',
    News = 'news',
    User = 'user',
}