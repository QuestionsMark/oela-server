import { IsString } from "class-validator";

export class UpdateImageAltDto {
    @IsString()
    alt: string;
}