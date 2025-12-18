import { api } from "../api/axios";
import type { AuthResponse } from "../types/auth.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export const AuthService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login", credentials);
        return response.data;
    },

    async registerClient(formData: FormData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
