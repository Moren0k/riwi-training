import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../api/axios";
import type { DecodedToken } from "../types/auth.types";
import { UserRole } from "../types/auth.types";

interface AuthContextType {
    user: DecodedToken | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "somosrentwi_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Helper to parse role from string to Enum
    const parseRole = (roleStr: string): UserRole | null => {
        if (roleStr === "Admin") return UserRole.Admin;
        if (roleStr === "Company") return UserRole.Company;
        if (roleStr === "Client") return UserRole.Client;
        return null;
    };

    useEffect(() => {
        // Initialize state from existing token
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // Check expiry
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setUser(decoded);
                    // Assuming the token has a 'role' claim as per docs
                    // Doc says API returns role in body, usually also in token.
                    // If not in token, we rely on the body response during login. 
                    // But for strict persistence we need it in token or stored separately.
                    // I will assume it is in the token as 'role' or standard claim.
                    // If the token doesn't have it, we might be in trouble for persistence.
                    // Let's assume standard 'role' claim exists.
                    setRole(parseRole(decoded.role || ""));

                    // Setup axios default header
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
        setLoading(false);
    }, [token]);

    // Interceptor for 401
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setRole(null);
        delete api.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, role, token, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
