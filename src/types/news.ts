import { CreateImagePreview, Img } from "./common";

export interface NewsInterface {
    id: string;
    name: string;
    description: string;
    images: Img[];
}

export interface CreateNewsInterface {
    name: string;
    description: string;
    preview: CreateImagePreview[];
}