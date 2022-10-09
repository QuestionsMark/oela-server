import { IsString, Length } from "class-validator";

export class ImagePreviewDto {
    @IsString()
    @Length(1, 255)
    alt: string;
}