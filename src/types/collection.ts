import { Img } from "./common";
import { FilteredProductInterface } from "./product";

export interface CollectionInterface {
    id: string;
    name: string;
    description: string;
    products: FilteredProductInterface[]
    hashtags: string[];
    images: Img[];
}