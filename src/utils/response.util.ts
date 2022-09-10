import { ServerResponse } from "../types";

export const getServerResponse = (message: string): ServerResponse => {
    return { message };
};