import { api } from "../api/axios";
import type { CompanyWallet, AdminWallet } from "../types/models.types";

export const WalletService = {
    async getCompanyWallet(): Promise<CompanyWallet> {
        const response = await api.get<CompanyWallet>("/company/wallet");
        return response.data;
    },

    async getAdminWallet(): Promise<AdminWallet> {
        const response = await api.get<AdminWallet>("/admin/wallet");
        return response.data;
    }
};
