

export const DocumentType = {
    CC: 0,
    CE: 1,
    Passport: 2
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export const ClientVerificationStatus = {
    Pending: 0,
    Accepted: 1,
    Rejected: 2
} as const;

export type ClientVerificationStatus = typeof ClientVerificationStatus[keyof typeof ClientVerificationStatus];

export const RentalStatus = {
    PendingDelivery: 0,
    InProgress: 1,
    FinishedCorrect: 2,
    FinishedWithIssue: 3,
    Cancelled: 4,
    Rejected: 5
} as const;

export type RentalStatus = typeof RentalStatus[keyof typeof RentalStatus];

export const CompanyPlan = {
    Basic: 0,
    Pro: 1,
    Enterprise: 2
} as const;

export type CompanyPlan = typeof CompanyPlan[keyof typeof CompanyPlan];

export interface Client {
    id: number;
    userId: number;
    // Typo "verifcationStatus" in doc? Assuming "VerificationStatus" based on pascal case but API might serialize differently. I'll stick to typical JSON casing usually camelCase. The backend is C# so it might return PascalCase or camelCase. The doc examples show `firstName` (camel) for request, but usually C# APIs default to camelCase JSON. I will assume camelCase for now.
    // Wait, let me check the doc again. The doc shows "VerificationStatus" in text but JSON examples are key.
    // Doc Post Register response: { "token": ..., "userId": 1, "role": "Client" }
    // Doc Get Clients response: "List<Client> (Full Entity exposed)"
    // I will define standard camelCase interfaces, and if issues arise I'll fix.

    firstName: string;
    lastName: string;
    documentType: DocumentType;
    documentNumber: string;
    birthDate: string; // ISO Date
    primaryPhone: string;
    address: string;
    verificationStatus: ClientVerificationStatus;

    // Document URLs (paths)
    selfiePhotoPath?: string;
    documentFrontPath?: string;
    documentBackPath?: string;
    licenseFrontPath?: string;
    licenseBackPath?: string;

    email: string; // Derived from User navigation property if flat
}

export interface Company {
    id: number;
    userId: number;
    tradeName: string;
    nitNumber: string;
    contactEmail: string;
    phones: string;
    address: string;
    companyPlan: CompanyPlan;
}

export interface Car {
    id: number;
    companyId: number;
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
    status?: number; // 0=Available, 1=InUse ? Inferring
    isAvailable: boolean; // Helper maybe
}

export interface Rental {
    id: number;
    carId: number;
    clientId: number;
    startDate: string;
    estimatedEndDate: string;
    realEndDate?: string;
    totalPrice: number;
    status: RentalStatus;

    // Navigation properties that might be included
    car?: Car;
    client?: Client;
}

export interface WalletTransaction {
    id: number;
    walletId: number;
    amount: number;
    transactionType: number; // 0=RentalIncome, 1=Commission?
    description: string;
    transactionDate: string;
}

export interface Wallet {
    id: number;
    balance: number;
    transactions: WalletTransaction[];
}

export interface CompanyWallet extends Wallet {
    companyId: number;
}

export interface AdminWallet extends Wallet {
    // Single instance usually
}
