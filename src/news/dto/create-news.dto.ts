import { IsString } from "class-validator";

export class CreateNewsDto {
    @IsString()
    data: string;
}
