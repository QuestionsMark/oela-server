import { IsString } from "class-validator";

export class CreateCoverDto {
    @IsString()
    data: string;
}
