import { ServerResponse } from "../types";

export const getServerResponse = (message: string, problems?: string[] | null): ServerResponse => {
    if (problems) return { message, problems };
    return { message };
};