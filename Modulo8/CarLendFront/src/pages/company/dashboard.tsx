import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { carService, rentalService } from '@/services';
import { Car, Rental, CompanyStats } from '@/types';
import Link from 'next/link';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatNumber';
import CompanyStatsCard from '@/components/CompanyStats';
import styles from '@/styles/pages/Dashboard.module.scss';

function CompanyDashboardContent() {
    const { company, user } = useAuth(); // Get user too
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load rentals separately to avoid failing both
            try {
                const rentalsData = await rentalService.getCompanyRentals();
                setRentals(rentalsData);
            } catch (err: any) {
                // If 403 and Admin, try fallback silently first
                if (err.response?.status === 403 && user?.role === 'Admin') {
                    console.warn('Access prohibited to CompanyRentals. Attempting Admin Fallback (GetAllRentals)...');
                    try {
                        const allRentals = await rentalService.getAll();
                        setRentals(allRentals);
                    } catch (fallbackError) {
                        console.error('Error fetching all rentals fallback:', fallbackError);
                    }
                } else {
                    // Real error
                    console.error('Error loading rentals:', err);
                }
            }

            // Load cars with fallback for Admin role (403 Forbidden on MyCars)
            try {
                const carsData = await carService.getMyCars();
                setCars(carsData);
            } catch (error: any) {
                // If 403, try fallback silently first
                if (error.response?.status === 403) {
                    console.warn('Access prohibited to MyCars. Attempting Admin Fallback (GetAllCars)...');
                    try {
                        const allCars = await carService.getAll();
                        setCars(allCars);
                    } catch (fallbackError) {
                        console.error('Error fetching all cars fallback:', fallbackError);
                    }
                } else {
                    // Real error
                    console.error('Error loading cars:', error);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats: CompanyStats = useMemo(() => {
        const active = rentals.filter(r => r.status === 1);
        const completed = rentals.filter(r => r.status === 2);

        const totalRevenue = rentals.reduce((sum, rental) => {
            return sum + (rental.actualTotalPrice || rental.estimatedTotalPrice || 0);
        }, 0);

        return {
            totalVehicles: cars.length,
            activeRentals: active.length,
            completedRentals: completed.length,
            totalRevenue
        };
    }, [cars, rentals]);

    // Allow Admin to access even without company profile
    if (!company && user?.role !== 'Admin') return null;

    // Mock name for Admin if company is missing
    const tradeName = company?.tradeName || (user?.role === 'Admin' ? 'Administrador' : 'Empresa');
    const isSubscribed = company ? company.subscriptionStatus === 1 : true; // Admin is always "subscribed"

    const recentRentals = rentals
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 5);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <div className={styles.welcomeSection}>
                    <h1>Dashboard de {tradeName}</h1>
                    <p>Gestiona tu flota y rentas</p>
                </div>
                <div className={`${styles.documentStatus} ${!isSubscribed ? 'inactive' : ''}`} style={{
                    background: isSubscribed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: isSubscribed ? '#22c55e' : '#ef4444'
                }}>
                    {isSubscribed ? '✓ Suscripción Activa' : '⚠ Suscripción Inactiva'}
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.section}>
                <CompanyStatsCard stats={stats} />
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
                <div className={styles.profileCard}>
                    <Link href="/company/vehicles" className={styles.rentalItem}>
                        <div className={styles.rentalInfo}>
                            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>🚙</span>
                            <h4>{user?.role === 'Admin' ? 'Todos los Vehículos' : 'Mis Vehículos'}</h4>
                            <p>Gestionar flota</p>
                        </div>
                    </Link>
                    {isSubscribed && (
                        <Link href="/company/add-vehicle" className={styles.rentalItem}>
                            <div className={styles.rentalInfo}>
                                <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>➕</span>
                                <h4>Agregar Vehículo</h4>
                                <p>Publicar nuevo auto</p>
                            </div>
                        </Link>
                    )}
                    <Link href="/company/rentals" className={styles.rentalItem}>
                        <div className={styles.rentalInfo}>
                            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>📋</span>
                            <h4>Rentas</h4>
                            <p>Ver historial</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Rentals */}
            {recentRentals.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.dashboardHeader} style={{ marginBottom: '1.5rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Últimas Rentas</h2>
                        <Link href="/company/rentals" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                            Ver todas →
                        </Link>
                    </div>
                    <div className={styles.recentRentals}>
                        {recentRentals.map((rental) => (
                            <Link href={`/rental/${rental.id}`} key={rental.id} className={styles.rentalItem}>
                                <div className={styles.rentalInfo}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4>{rental.car?.brand} {rental.car?.model}</h4>
                                        <span className={styles.documentStatus} style={{
                                            background: rental.status === 0 ? 'rgba(251, 191, 36, 0.2)' : rental.status === 1 ? 'rgba(34, 197, 94, 0.1)' : '',
                                            color: rental.status === 0 ? '#f59e0b' : rental.status === 1 ? '#22c55e' : '',
                                            padding: '0.1rem 0.5rem',
                                            fontSize: '0.75rem'
                                        }}>
                                            {rental.status === 0 ? 'Pendiente' : rental.status === 1 ? 'Activa' : rental.status === 2 ? 'Completada' : 'Cancelada'}
                                        </span>
                                    </div>
                                    <p>Cliente: {rental.client?.firstName} {rental.client?.lastName}</p>
                                </div>
                                <div className={styles.rentalPrice}>
                                    {formatCurrency(rental.estimatedTotalPrice)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Company Info - Only show if company exists, or show simplified admin info */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Información de {tradeName}</h2>
                <div className={styles.profileCard}>
                    {company ? (
                        <>
                            <div className={styles.profileItem}>
                                <label>Razón Social</label>
                                <span>{company.tradeName}</span>
                            </div>
                            <div className={styles.profileItem}>
                                <label>NIT</label>
                                <span>{company.nitNumber}</span>
                            </div>
                            <div className={styles.profileItem}>
                                <label>Email Contacto</label>
                                <span>{company.contactEmail}</span>
                            </div>
                            <div className={styles.profileItem}>
                                <label>Plan Actual</label>
                                <span>{company.companyPlan === 1 ? 'Básico' : company.companyPlan === 2 ? 'Premium' : 'Enterprise'}</span>
                            </div>
                        </>
                    ) : (
                        <div className={styles.profileItem}>
                            <label>Rol</label>
                            <span>Administrador del Sistema</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CompanyDashboard() {
    return (
        <ProtectedRoute>
            <CompanyDashboardContent />
        </ProtectedRoute>
    );
}
