import { api } from "../api/axios";
import type { Car } from "../types/models.types";

export const CarsService = {
    async getAll(): Promise<Car[]> {
        const response = await api.get<Car[]>("/cars");
        return response.data;
    },

    async getById(id: number): Promise<Car> {
        const response = await api.get<Car>(`/cars/${id}`);
        return response.data;
    },

    async getByCompanyId(companyId: number): Promise<Car[]> {
        const response = await api.get<Car[]>(`/cars/company/${companyId}`);
        return response.data;
    },

    async getMyCars(): Promise<Car[]> {
        const response = await api.get<Car[]>("/cars/my-cars");
        return response.data;
    },

    async create(formData: FormData): Promise<Car> {
        const response = await api.post<Car>("/cars", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    async update(id: number, formData: FormData): Promise<Car> {
        const response = await api.put<Car>(`/cars/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/cars/${id}`);
    }
};
