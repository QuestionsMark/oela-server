import { IsString, Length } from "class-validator";

export class CreateHashtagDto {
    @IsString()
    @Length(1, 100)
    name: string;
}
