import { Img } from "./common";
import { SpecificationInterface } from "./specification";

export interface ProductInterface {
    id: string;
    name: string;
    description: string;
    shopLink: string;
    productType: string;
    hashtags: string[];
    images: Img[];
    specifications: SpecificationInterface[];
}

export interface FilteredProductInterface {
    id: string;
    name: string;
    productType: string;
    images: Img[];
}