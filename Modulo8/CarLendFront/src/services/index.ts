import api from './api';
import { normalizeResponse } from '@/utils/mapper';
import {
    RegisterClientRequest,
    CreateCompanyRequest,
    LoginRequest,
    AuthResponse,
    Car,
    CreateCarRequest,
    UpdateCarRequest,
    Rental,
    CreateRentalRequest,
    CancelRentalRequest,
    Company,
} from '@/types';

// Auth Services
export const authService = {
    registerClient: async (data: RegisterClientRequest): Promise<AuthResponse> => {
        try {
            const formData = new FormData();
            // PascalCase keys for FormData as confirmed by successful DB checks
            formData.append('Email', data.email);
            formData.append('Password', data.password);
            formData.append('FirstName', data.firstName);
            formData.append('LastName', data.lastName);
            formData.append('DocumentType', data.documentType.toString());
            formData.append('DocumentNumber', data.documentNumber);
            // Fix: Swagger expects date-time (ISO 8601), but input is YYYY-MM-DD.
            // Appending T00:00:00.000Z to ensure it parses correctly.
            const isoBirthDate = new Date(data.birthDate).toISOString();
            formData.append('BirthDate', isoBirthDate);
            formData.append('PrimaryPhone', data.primaryPhone);
            formData.append('Address', data.address);
            if (data.selfiePhoto) formData.append('SelfiePhoto', data.selfiePhoto);
            if (data.documentFront) formData.append('DocumentFront', data.documentFront);
            if (data.documentBack) formData.append('DocumentBack', data.documentBack);
            if (data.licenseFront) formData.append('LicenseFront', data.licenseFront);
            if (data.licenseBack) formData.append('LicenseBack', data.licenseBack);

            console.log('--- Register Payload Debug ---');
            // @ts-ignore
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
            }
            console.log('------------------------------');

            const response = await api.post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return normalizeResponse(response.data);
        } catch (error: any) {
            console.error('Register Error Full Details:', error);
            if (error.response?.data) {
                console.error('Server Error Response:', JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    },

    registerCompany: async (data: CreateCompanyRequest): Promise<AuthResponse> => {
        // Use admin/companies endpoint as identified in Swagger
        const response = await api.post('/admin/companies', data);
        return normalizeResponse(response.data);
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        try {
            // Swagger defines LoginRequest as: { email: string, password: string }
            // Using strict lowercase to match Swagger
            const payload = {
                email: data.email,
                password: data.password
            };
            console.log('Sending Login Payload:', JSON.stringify(payload));

            const response = await api.post('/auth/login', payload);
            const normalized = normalizeResponse(response.data);

            // Fix: Backend returns flat structure, we need nested user object
            if (!normalized.user && normalized.userId) {
                normalized.user = {
                    id: normalized.userId,
                    role: normalized.role || 'User',
                    email: normalized.email || data.email, // Fallback to provided email
                };
            }

            // Fix: Ensure role is in user object for consistency
            if (normalized.user && !normalized.user.role && normalized.role) {
                normalized.user.role = normalized.role;
            }

            return normalized;
        } catch (error: any) {
            console.error('Login Error Full Details:', error);
            if (error.response?.data) {
                console.error('Server Error Response:', JSON.stringify(error.response.data, null, 2));
            }
            // Re-throw to be handled by the component
            throw error;
        }
    },
};

// Car Services
export const carService = {
    getAll: async (): Promise<Car[]> => {
        const response = await api.get('/Cars?PageNumber=1&PageSize=100');
        const normalized = normalizeResponse(response.data);
        return normalized.map((car: any) => ({
            ...car,
            isAvailable: car.status === 0 // 0 = Available
        }));
    },

    getById: async (id: number): Promise<Car> => {
        const response = await api.get(`/Cars/${id}`);
        const normalized = normalizeResponse(response.data);
        return {
            ...normalized,
            isAvailable: normalized.status === 0
        };
    },

    getMyCars: async (): Promise<Car[]> => {
        const response = await api.get('/Cars/my-cars');
        const normalized = normalizeResponse(response.data);
        return normalized.map((car: any) => ({
            ...car,
            isAvailable: car.status === 0
        }));
    },

    getByCompany: async (companyId: number): Promise<Car[]> => {
        const response = await api.get(`/Cars/company/${companyId}`);
        const normalized = normalizeResponse(response.data);
        return normalized.map((car: any) => ({
            ...car,
            isAvailable: car.status === 0
        }));
    },

    create: async (data: CreateCarRequest): Promise<Car> => {
        const formData = new FormData();
        formData.append('Brand', data.brand);
        formData.append('Model', data.model);
        formData.append('Year', data.year.toString());
        formData.append('Plate', data.plate);
        formData.append('Color', data.color);
        formData.append('CommercialValue', data.commercialValue.toString());
        formData.append('BasePricePerHour', data.basePricePerHour.toString());
        formData.append('SoatExpirationDate', data.soatExpirationDate);
        formData.append('TechExpirationDate', data.techExpirationDate);
        formData.append('MainPhoto', data.mainPhoto);

        const response = await api.post('/Cars', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return normalizeResponse(response.data);
    },

    update: async (id: number, data: UpdateCarRequest): Promise<Car> => {
        const formData = new FormData();
        formData.append('Brand', data.brand);
        formData.append('Model', data.model);
        formData.append('Year', data.year.toString());
        formData.append('Plate', data.plate);
        formData.append('Color', data.color);
        formData.append('CommercialValue', data.commercialValue.toString());
        formData.append('BasePricePerHour', data.basePricePerHour.toString());
        formData.append('SoatExpirationDate', data.soatExpirationDate);
        formData.append('TechExpirationDate', data.techExpirationDate);
        if (data.mainPhoto) {
            formData.append('MainPhoto', data.mainPhoto);
        }

        const response = await api.put(`/Cars/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return normalizeResponse(response.data);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/Cars/${id}`);
    },
};

// Rental Services
export const rentalService = {
    getAll: async (): Promise<Rental[]> => {
        // PER SWAGGER ANALYSIS: There is NO endpoint to get all rentals (GET /api/Rentals does not exist).
        // The 400 Error for /Rentals/getAll was because it matched /Rentals/{id} (int) and failed parsing.
        // For now, we must return empty array to prevent dashboard crash until Backend adds this endpoint.
        console.warn('Backend missing GetAllRentals endpoint. Returning empty list.');
        return [];
    },

    create: async (data: CreateRentalRequest): Promise<Rental> => {
        try {
            console.log('--- Rental Create Payload ---', JSON.stringify(data, null, 2));
            const response = await api.post('/Rentals', data);
            return normalizeResponse(response.data);
        } catch (error: any) {
            console.error('Rental Create Error:', error);
            if (error.response?.data) {
                console.error('Server Validation Details:', JSON.stringify(error.response.data, null, 2));
                alert(`Error Server: ${JSON.stringify(error.response.data)}`); // Show to user so they can report it
            }
            throw error;
        }
    },

    getById: async (id: number): Promise<Rental> => {
        const response = await api.get(`/Rentals/${id}`);
        return normalizeResponse(response.data);
    },

    getMyRentals: async (): Promise<Rental[]> => {
        const response = await api.get('/Rentals/my-rentals');
        return normalizeResponse(response.data);
    },

    getCompanyRentals: async (): Promise<Rental[]> => {
        const response = await api.get('/Rentals/company-rentals');
        return normalizeResponse(response.data);
    },

    deliver: async (id: number): Promise<void> => {
        await api.post(`/Rentals/${id}/deliver`);
    },

    complete: async (id: number): Promise<void> => {
        await api.post(`/Rentals/${id}/complete`);
    },

    cancel: async (id: number, data: CancelRentalRequest): Promise<void> => {
        await api.post(`/Rentals/${id}/cancel`, data);
    },
};
