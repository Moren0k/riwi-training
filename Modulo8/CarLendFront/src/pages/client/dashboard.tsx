import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { rentalService } from '@/services';
import { Rental, ClientStats } from '@/types';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '@/utils/formatNumber';
import ClientStatsCard from '@/components/ClientStats';
import styles from '@/styles/pages/Dashboard.module.scss';

function ClientDashboardContent() {
    const { client } = useAuth();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            const data = await rentalService.getMyRentals();
            setRentals(data);
        } catch (error) {
            console.error('Error loading rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats: ClientStats = useMemo(() => {
        const active = rentals.filter(r => r.status === 1);
        const completed = rentals.filter(r => r.status === 2);

        const totalSpent = rentals.reduce((sum, rental) => {
            return sum + (rental.actualTotalPrice || rental.estimatedTotalPrice || 0);
        }, 0);

        return {
            totalRentals: rentals.length,
            activeRentals: active.length,
            completedRentals: completed.length,
            totalSpent
        };
    }, [rentals]);

    if (!client) return null;

    const activeRentals = rentals.filter(r => r.status === 1);
    const recentRentals = rentals
        .filter(r => r.status === 2 || r.status === 3)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 5);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <div className={styles.welcomeSection}>
                    <h1>Bienvenido, {client.firstName}</h1>
                    <p>Gestiona tus rentas y documentos</p>
                </div>
                <div className={styles.documentStatus}>
                    ✓ Documentos Verificados
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.section}>
                <ClientStatsCard stats={stats} />
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
                <div className={styles.profileCard}>
                    <Link href="/catalog" className={styles.rentalItem}>
                        <div className={styles.rentalInfo}>
                            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>🔍</span>
                            <h4>Buscar Vehículos</h4>
                            <p>Explora nuestro catálogo</p>
                        </div>
                    </Link>
                    <Link href="/client/rentals" className={styles.rentalItem}>
                        <div className={styles.rentalInfo}>
                            <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>📋</span>
                            <h4>Mis Rentas</h4>
                            <p>Ver historial completo</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Active Rentals */}
            {activeRentals.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Rentas Activas</h2>
                    <div className={styles.recentRentals}>
                        {activeRentals.map((rental) => (
                            <Link href={`/rental/${rental.id}`} key={rental.id} className={styles.rentalItem}>
                                <div className={styles.rentalInfo}>
                                    <h4>{rental.car?.brand} {rental.car?.model}</h4>
                                    <p>Inicio: {formatDateTime(rental.startDate)}</p>
                                </div>
                                <div className={styles.rentalPrice}>
                                    {formatCurrency(rental.estimatedTotalPrice)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent History */}
            {recentRentals.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.dashboardHeader} style={{ marginBottom: '1.5rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Historial Reciente</h2>
                        <Link href="/client/rentals" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                            Ver todo →
                        </Link>
                    </div>
                    <div className={styles.recentRentals}>
                        {recentRentals.map((rental) => (
                            <Link href={`/rental/${rental.id}`} key={rental.id} className={styles.rentalItem}>
                                <div className={styles.rentalInfo}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4>{rental.car?.brand} {rental.car?.model}</h4>
                                        <span className={styles.documentStatus} style={{
                                            background: rental.status === 2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: rental.status === 2 ? '#22c55e' : '#ef4444',
                                            padding: '0.1rem 0.5rem',
                                            fontSize: '0.75rem'
                                        }}>
                                            {rental.status === 2 ? 'Completada' : 'Cancelada'}
                                        </span>
                                    </div>
                                    <p>{formatDateTime(rental.startDate)}</p>
                                </div>
                                <div className={styles.rentalPrice}>
                                    {formatCurrency(rental.actualTotalPrice || rental.estimatedTotalPrice)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Profile Information */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Tu Información</h2>
                <div className={styles.profileCard}>
                    <div className={styles.profileItem}>
                        <label>Nombre Completo</label>
                        <span>{client.firstName} {client.lastName}</span>
                    </div>
                    <div className={styles.profileItem}>
                        <label>Documento</label>
                        <span>{client.documentNumber}</span>
                    </div>
                    <div className={styles.profileItem}>
                        <label>Teléfono</label>
                        <span>{client.primaryPhone}</span>
                    </div>
                    <div className={styles.profileItem}>
                        <label>Dirección</label>
                        <span>{client.address}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ClientDashboard() {
    return (
        <ProtectedRoute>
            <ClientDashboardContent />
        </ProtectedRoute>
    );
}
