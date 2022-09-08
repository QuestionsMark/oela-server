import { genSalt, hash } from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(11);
    return hash(password, salt);
};