import { unlink } from "fs/promises";
import { MulterFile } from "../types";
import * as path from 'path';
import { multerStorageDir } from "./storage.util";

export const unlinkFiles = async (files: MulterFile[] | { filename: string }[]) => {
    for (const { filename } of files) {
        await unlink(path.join(multerStorageDir(), filename));
    }
}