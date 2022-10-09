export enum CookieName {
    AuthToken = 'jwt',
}

export interface JwtPayload {
    id: string;
}

export interface CreateToken {
    accessToken: string;
    expiresIn: number;
}

export interface IsAccountResponse {
    results: boolean;
}