import { IsString, Length } from "class-validator";

export class CreateProductTypeDto {
    @IsString()
    @Length(1, 100)
    name: string;
}
