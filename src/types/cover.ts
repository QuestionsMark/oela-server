import { CreateImagePreview, Img } from "./common";

export interface CoverInterface {
    id: string;
    image: Img;
}

export interface CreateCoverInterface {
    preview: CreateImagePreview[];
}