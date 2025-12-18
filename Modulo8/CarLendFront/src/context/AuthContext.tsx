import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Client, Company, AuthResponse } from '@/types';

interface AuthContextType {
    user: User | null;
    client: Client | null;
    company: Company | null;
    isAuthenticated: boolean;
    isClient: boolean;
    isCompany: boolean;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user data from localStorage on mount
        try {
            const storedUser = localStorage.getItem('user');
            const storedClient = localStorage.getItem('client');
            const storedCompany = localStorage.getItem('company');
            const token = localStorage.getItem('token');

            if (token && storedUser && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
                if (storedClient && storedClient !== 'undefined') {
                    setClient(JSON.parse(storedClient));
                }
                if (storedCompany && storedCompany !== 'undefined') {
                    setCompany(JSON.parse(storedCompany));
                }
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
            // Clear corrupted data
            localStorage.removeItem('user');
            localStorage.removeItem('client');
            localStorage.removeItem('company');
            localStorage.removeItem('token');
        }
        setLoading(false);
    }, []);

    const login = (authData: AuthResponse) => {
        const { token, user, client, company } = authData;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);

        if (client) {
            localStorage.setItem('client', JSON.stringify(client));
            setClient(client);
        }

        if (company) {
            localStorage.setItem('company', JSON.stringify(company));
            setCompany(company);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('client');
        localStorage.removeItem('company');
        setUser(null);
        setClient(null);
        setCompany(null);
    };

    const value = {
        user,
        client,
        company,
        isAuthenticated: !!user,
        isClient: !!client || user?.role?.toLowerCase() === 'client',
        isCompany: !!company || user?.role?.toLowerCase() === 'company' || user?.role?.toLowerCase() === 'admin',
        login,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
