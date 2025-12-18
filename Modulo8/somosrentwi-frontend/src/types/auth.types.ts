export const UserRole = {
    Admin: 0,
    Company: 1,
    Client: 2,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface AuthResponse {
    token: string;
    userId: number;
    role: string; // The API returns "Admin", "Company", "Client" as strings based on the doc example
}

export interface DecodedToken {
    sub: string;     // Usually userId or email depending on backend impl
    unique_name?: string;
    email?: string;
    role: string;    // "Admin", "Company", "Client"
    exp: number;
    iat: number;
    nbf: number;
    [key: string]: any;
}
