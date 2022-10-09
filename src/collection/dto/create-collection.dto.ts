import { IsString } from "class-validator";

export class CreateCollectionDto {
    @IsString()
    data: string;
}
