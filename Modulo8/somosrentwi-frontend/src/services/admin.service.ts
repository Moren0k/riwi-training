import { api } from "../api/axios";
import type { Client, Company } from "../types/models.types";
import { ClientVerificationStatus } from "../types/models.types";

export const AdminService = {
    // Companies
    async createCompany(data: any): Promise<Company> {
        const response = await api.post<Company>("/admin/companies", data);
        return response.data;
    },

    // Clients
    async getAllClients(): Promise<Client[]> {
        const response = await api.get<Client[]>("/admin/clients");
        return response.data;
    },

    async updateClientStatus(clientId: number, status: ClientVerificationStatus): Promise<void> {
        await api.patch(`/admin/clients/${clientId}/verification-status`, { status });
    }
};
