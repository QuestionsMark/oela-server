import { UpdateImageAltDto } from "src/file/dto/image-alt.dto";
import { CreateHashtagDto } from "src/hashtag/dto/create-hashtag.dto";
import { CreateProductTypeDto } from "src/product-type/dto/create-product-type.dto";
import { CreateCollectionInterface, CreateCoverInterface, CreateNewsInterface, CreateProductDataInterface, MulterFile } from "../types";
import { ValidationException } from "./custom-exceptions/validation.exception";

// PRODUCT

export const createProductValidation = (data: CreateProductDataInterface, images: MulterFile[] | null, update?: boolean) => {
    const errors: string[] = [];
    const { description, name, preview, productType, shopLink, specifications } = data;

    if (!update) {
        if (!images || images.length < 2) {
            errors.push('Produkt musi zawierać conajmniej 2 zdjęcia.');
        }
    }
    if (images && images.length !== preview.length) {
        errors.push('Ilość grafik nie zgadza się z ilością ich opisów.');
    }
    const checkImageAlt = preview.find(i => !i.alt);
    if (checkImageAlt) {
        errors.push('Grafiki powinny mieć swoje opisy.');
    }

    if (!name || name.length > 100) {
        errors.push('Nazwa produktu powinna zawierać od 1 do 100 znaków.');
    }

    if (!description || description.length > 1000) {
        errors.push('Opis produktu powinien zawierać od 1 do 1000 znaków.');
    }

    if (!productType) {
        errors.push('Wybierz typ produktu.');
    }

    if (!shopLink) {
        errors.push('Podaj link do sklepu.');
    }

    if (specifications.length > 0) {
        let error = false;
        let nameLengthError = false;
        let valueLengthError = false;
        for (const spec of specifications) {
            if (!spec.value || !spec.name) {
                error = true;
            }
            if (spec.name && spec.name.length > 100) {
                nameLengthError = true;
            }
            if (spec.value && spec.value.length > 100) {
                valueLengthError = true;
            }
        }
        if (error) {
            errors.push('Nieprawidłowe dane w specyfikacjach.');
        }
        if (nameLengthError) {
            errors.push('Nazwy specyfikacji nie mogą przekroczyć 100 znaków.');
        }
        if (valueLengthError) {
            errors.push('Wartości specyfikacji nie mogą przekroczyć 100 znaków.');
        }
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}




// COLLECTION

export const createCollectionValidation = (data: CreateCollectionInterface, images: MulterFile[] | null, update?: boolean) => {
    const errors: string[] = [];
    const { description, name, preview } = data;

    if (!update) {
        if (!images || images.length < 2) {
            errors.push('Kolekcja musi zawierać conajmniej 2 zdjęcia.');
        }
    }
    if (images && images.length !== preview.length) {
        errors.push('Ilość grafik nie zgadza się z ilością ich opisów.');
    }
    const checkImageAlt = preview.find(i => !i.alt);
    if (checkImageAlt) {
        errors.push('Grafiki powinny mieć swoje opisy.');
    }

    if (!name || name.length > 100) {
        errors.push('Nazwa kolekcji powinna zawierać od 1 do 100 znaków.');
    }

    if (!description || description.length > 1000) {
        errors.push('Opis kolekcji powinien zawierać od 1 do 1000 znaków.');
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}




// NEWS

export const createNewsValidation = (data: CreateNewsInterface, images: MulterFile[] | null, update?: boolean) => {
    const errors: string[] = [];
    const { description, name, preview } = data;

    if (!update) {
        if (!images || images.length < 2) {
            errors.push('Nowość musi zawierać conajmniej 1 grafikę.');
        }
    }
    if (images && images.length !== preview.length) {
        errors.push('Ilość grafik nie zgadza się z ilością ich opisów.');
    }
    const checkImageAlt = preview.find(i => !i.alt);
    if (checkImageAlt) {
        errors.push('Grafiki powinny mieć swoje opisy.');
    }

    if (!name || name.length > 100) {
        errors.push('Nazwa nowości powinna zawierać od 1 do 100 znaków.');
    }

    if (!description || description.length > 1000) {
        errors.push('Opis nowości powinien zawierać od 1 do 1000 znaków.');
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}




// HASHTAG

export const createHashtagValidation = (data: CreateHashtagDto) => {
    const errors: string[] = [];
    const { name } = data;

    if (typeof name !== 'string' || name.length === 0 || name.length > 100) {
        errors.push('Nazwa hashtagu powinna zawierać od 1 do 100 znaków.');
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}




// PRODUCT_TYPE

export const createProductTypeValidation = (data: CreateProductTypeDto) => {
    const errors: string[] = [];
    const { name } = data;

    if (typeof name !== 'string' || name.length === 0 || name.length > 100) {
        errors.push('Nazwa typu produktu powinna zawierać od 1 do 100 znaków.');
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}




// COVER

export const createCoverValidation = (data: CreateCoverInterface, images: MulterFile[] | null) => {
    const errors: string[] = [];
    const { preview } = data;

    if (!images || images.length < 1) {
        errors.push('Do dodania okładki potrzebna jest grafika.');
    }
    if (images && images.length !== preview.length) {
        errors.push('Ilość grafik nie zgadza się z ilością ich opisów.');
    }
    const checkImageAlt = preview.find(i => !i.alt);
    if (checkImageAlt) {
        errors.push('Grafiki powinny mieć swoje opisy.');
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}




// ALT

export const changeAltValidation = (data: UpdateImageAltDto) => {
    const errors: string[] = [];
    const { alt } = data;

    if (typeof alt !== 'string' || alt.length === 0 || alt.length > 255) {
        errors.push('Opis grafiki powinien zawierać od 1 do 255 znaków.');
    }

    if (errors.length > 0) throw new ValidationException('Invalid data!', errors);
}