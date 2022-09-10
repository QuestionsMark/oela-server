import { CreateImagePreview, Img } from "./common";
import { HashtagInterface } from "./hashtag";
import { ProductTypeInterface } from "./product-type";
import { CreateSpecificationInterface, SpecificationInterface } from "./specification";

export interface ProductInterface {
    id: string;
    name: string;
    description: string;
    shopLink: string;
    productType: ProductTypeInterface;
    hashtags: HashtagInterface[];
    images: Img[];
    specifications: SpecificationInterface[];
}

export interface FilteredProductInterface {
    id: string;
    name: string;
    productType: string;
    images: Img[];
}

export interface CreateProductDataInterface {
    description: string;
    hashtags: string[];
    name: string;
    productType: string;
    shopLink: string;
    specifications: CreateSpecificationInterface[];
    preview: CreateImagePreview[]
}