import { ServerResponse } from "../types";

export const getServerResponse = (status: number, message: string): ServerResponse => {
    return { status, message };
};