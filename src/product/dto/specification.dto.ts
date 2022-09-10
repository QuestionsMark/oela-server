import { IsString, Length } from "class-validator";

export class CreateSpecificationDto {
    @IsString()
    @Length(1, 100)
    name: string;

    @IsString()
    @Length(1, 100)
    value: string;
}