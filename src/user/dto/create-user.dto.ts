import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    login: string;

    @IsString()
    password: string;
}
