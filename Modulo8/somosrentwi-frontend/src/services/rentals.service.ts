import { api } from "../api/axios";
import type { Rental } from "../types/models.types";

export interface CreateRentalRequest {
    carId: number;
    startDate: string;
    estimatedEndDate: string;
}

export interface CancelRentalRequest {
    reason: string;
}

export const RentalsService = {
    async create(data: CreateRentalRequest): Promise<Rental> {
        const response = await api.post<Rental>("/rentals", data);
        return response.data;
    },

    async getById(id: number): Promise<Rental> {
        const response = await api.get<Rental>(`/rentals/${id}`);
        return response.data;
    },

    async getMyRentals(): Promise<Rental[]> {
        const response = await api.get<Rental[]>("/rentals/my-rentals");
        return response.data;
    },

    async getCompanyRentals(): Promise<Rental[]> {
        const response = await api.get<Rental[]>("/rentals/company-rentals");
        return response.data;
    },

    async deliver(id: number): Promise<Rental> {
        const response = await api.post<Rental>(`/rentals/${id}/deliver`);
        return response.data;
    },

    async complete(id: number): Promise<Rental> {
        const response = await api.post<Rental>(`/rentals/${id}/complete`);
        return response.data;
    },

    async cancel(id: number, reason: string): Promise<Rental> {
        const response = await api.post<Rental>(`/rentals/${id}/cancel`, { reason });
        return response.data;
    },
};
