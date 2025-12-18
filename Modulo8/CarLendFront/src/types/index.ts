export enum ClientDocumentType {
    CedulaCiudadania = 0,
    CedulaExtranjeria = 1,
}

export enum CompanyPlan {
    None = 0,
    Basic = 1,
    Premium = 2,
    Enterprise = 3,
}

export enum CompanySubscriptionStatus {
    Inactive = 0,
    Active = 1,
    Expired = 2,
    Suspended = 3,
}

export enum RentalStatus {
    Pending = 0,
    Active = 1,
    Completed = 2,
    Cancelled = 3,
}

export interface User {
    id: number;
    email: string;
    role: string;
}

export interface Client {
    id: number;
    userId: number;
    user?: User;
    firstName: string;
    lastName: string;
    documentType: ClientDocumentType;
    documentNumber: string;
    birthDate: string;
    primaryPhone: string;
    address: string;
    selfiePhotoUrl?: string;
    documentFrontUrl?: string;
    documentBackUrl?: string;
    licenseFrontUrl?: string;
    licenseBackUrl?: string;
}

export interface Company {
    id: number;
    userId: number;
    user?: User;
    tradeName: string;
    nitNumber: string;
    contactEmail: string;
    landlineNumber: string;
    mobilePhone: string;
    address: string;
    website: string;
    companyPlan: CompanyPlan;
    subscriptionStatus: CompanySubscriptionStatus;
    startSubscriptionDate?: string;
    endSubscriptionDate?: string;
}

export interface Car {
    id: number;
    companyId: number;
    company?: Company;
    brand: string;
    model: string;
    year: number;
    plate: string;
    color: string;
    commercialValue: number;
    basePricePerHour: number;
    soatExpirationDate: string;
    techExpirationDate: string;
    mainPhotoUrl?: string;
    isAvailable: boolean;
}

export interface Rental {
    id: number;
    carId: number;
    car?: Car;
    clientId: number;
    client?: Client;
    startDate: string;
    estimatedEndDate: string;
    actualEndDate?: string;
    estimatedHours: number;
    actualHours?: number;
    basePricePerHour: number;
    estimatedTotalPrice: number;
    actualTotalPrice?: number;
    status: RentalStatus;
    cancellationReason?: string;
}

// Auth Request/Response Types
export interface RegisterClientRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    documentType: ClientDocumentType;
    documentNumber: string;
    birthDate: string;
    primaryPhone: string;
    address: string;
    selfiePhoto: File;
    documentFront: File;
    documentBack: File;
    licenseFront: File;
    licenseBack: File;
}

export interface CreateCompanyRequest {
    email: string;
    password: string;
    tradeName: string;
    nitNumber: string;
    contactEmail: string;
    landlineNumber: string;
    mobilePhone: string;
    address: string;
    website: string;
    companyPlan: CompanyPlan;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    client?: Client;
    company?: Company;
}

// Car Request Types
export interface CreateCarRequest {
    brand: string;
    model: string;
    year: number;
    plate: string;
    color: string;
    commercialValue: number;
    basePricePerHour: number;
    soatExpirationDate: string;
    techExpirationDate: string;
    mainPhoto: File;
}

export interface UpdateCarRequest extends CreateCarRequest { }

// Rental Request Types
export interface CreateRentalRequest {
    carId: number;
    startDate: string;
    estimatedEndDate: string;
}

export interface CancelRentalRequest {
    reason: string;
}

export interface ClientStats {
    totalRentals: number;
    activeRentals: number;
    completedRentals: number;
    totalSpent: number;
}

export interface CompanyStats {
    totalVehicles: number;
    activeRentals: number;
    completedRentals: number;
    totalRevenue: number;
    mostRentedCar?: Car;
}
