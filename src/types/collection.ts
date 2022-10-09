import { CreateImagePreview, Img } from "./common";
import { FilteredProductInterface } from "./product";

export interface CollectionInterface {
    id: string;
    name: string;
    description: string;
    products: FilteredProductInterface[];
    images: Img[];
}

export interface CreateCollectionInterface {
    name: string;
    description: string;
    products: string[];
    preview: CreateImagePreview[];
}