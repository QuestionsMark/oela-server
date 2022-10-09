import { FileItem } from "../file/file.entity";

export function filterImages<T>(obj: { images: FileItem[] }): T {
    return { ...obj, images: obj.images.map(({ alt, id, createdAt }) => ({ alt, id, createdAt })) } as T;
}

export function filterImagesInArray<T>(objs: { images: FileItem[] }[]): T[] {
    return objs.map(o => ({ ...o, images: o.images.map(({ alt, id, createdAt }) => ({ alt, id, createdAt })) })) as T[];
}