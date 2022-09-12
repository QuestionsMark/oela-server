import { FileItem } from "../file/file.entity";

export function sortImages<T>(obj: { images: FileItem[] }): T {
    obj.images.sort((a, b) => +a.createdAt - +b.createdAt);
    return obj as T;
};

export function sortImagesInArray<T>(objs: { images: FileItem[] }[]): T[] {
    return objs.map(o => {
        o.images.sort((a, b) => +a.createdAt - +b.createdAt);
        return o;
    }) as T[];
};