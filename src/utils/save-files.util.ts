import { CreateImagePreview, MulterFile } from "../types";
import { FileItem } from "../file/file.entity";

export const saveFiles = async (files: MulterFile[], preview?: CreateImagePreview[]): Promise<FileItem[]> => {
    const filesList: FileItem[] = [];
    for (const { filename } of files) {
        const newFile = new FileItem();
        newFile.filename = filename;
        if (preview) {
            newFile.alt = preview[filesList.length].alt;
        }
        const image = await newFile.save();
        filesList.push(image);
    }
    return filesList;
};