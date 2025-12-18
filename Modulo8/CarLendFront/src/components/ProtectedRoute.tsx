import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requireCompany?: boolean;
    requireClient?: boolean;
}

export default function ProtectedRoute({
    children,
    requireCompany = false,
    requireClient = false
}: ProtectedRouteProps) {
    const { isAuthenticated, isCompany, isClient, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else if (requireCompany && !isCompany) {
                router.push('/');
            } else if (requireClient && !isClient) {
                router.push('/');
            }
        }
    }, [isAuthenticated, isCompany, isClient, loading, router, requireCompany, requireClient]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requireCompany && !isCompany) {
        return null;
    }

    if (requireClient && !isClient) {
        return null;
    }

    return <>{children}</>;
}
