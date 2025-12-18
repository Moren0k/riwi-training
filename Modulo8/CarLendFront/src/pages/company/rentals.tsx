import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { rentalService } from '@/services';
import { Rental, RentalStatus } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import styles from '@/styles/pages/Rentals.module.scss';

function CompanyRentalsPage() {
    const { company } = useAuth();
    const router = useRouter();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | RentalStatus>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            setLoading(true);
            const data = await rentalService.getCompanyRentals();
            setRentals(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar rentas');
        } finally {
            setLoading(false);
        }
    };

    const handleDeliver = async (id: number) => {
        if (!confirm('¿Confirmas la entrega de este vehículo?')) return;

        try {
            await rentalService.deliver(id);
            loadRentals();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al entregar vehículo');
        }
    };

    const handleComplete = async (id: number) => {
        if (!confirm('¿Confirmas la finalización de esta renta?')) return;

        try {
            await rentalService.complete(id);
            loadRentals();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al completar renta');
        }
    };

    const filteredRentals = rentals.filter(rental => {
        if (filter === 'all') return true;
        return rental.status === filter;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusLabel = (status: RentalStatus) => {
        const labels = {
            [RentalStatus.Pending]: 'Pendiente',
            [RentalStatus.Active]: 'Activa',
            [RentalStatus.Completed]: 'Completada',
            [RentalStatus.Cancelled]: 'Cancelada',
        };
        return labels[status];
    };

    const getStatusClass = (status: RentalStatus) => {
        const classes = {
            [RentalStatus.Pending]: styles.pending,
            [RentalStatus.Active]: styles.active,
            [RentalStatus.Completed]: styles.completed,
            [RentalStatus.Cancelled]: styles.cancelled,
        };
        return classes[status];
    };

    if (company?.subscriptionStatus !== 1) {
        return (
            <div className={styles.container}>
                <div className={styles.noSubscription}>
                    <h1>Suscripción Requerida</h1>
                    <p>Necesitas una suscripción activa para ver las rentas.</p>
                    <Button onClick={() => router.push('/plans')}>
                        Ver Planes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Rentas de Vehículos</h1>
                    <p className={styles.subtitle}>
                        Gestiona las rentas de tu flota
                    </p>
                </div>
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todas ({rentals.length})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === RentalStatus.Pending ? styles.active : ''}`}
                    onClick={() => setFilter(RentalStatus.Pending)}
                >
                    Pendientes ({rentals.filter(r => r.status === RentalStatus.Pending).length})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === RentalStatus.Active ? styles.active : ''}`}
                    onClick={() => setFilter(RentalStatus.Active)}
                >
                    Activas ({rentals.filter(r => r.status === RentalStatus.Active).length})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === RentalStatus.Completed ? styles.active : ''}`}
                    onClick={() => setFilter(RentalStatus.Completed)}
                >
                    Completadas ({rentals.filter(r => r.status === RentalStatus.Completed).length})
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Cargando rentas...</div>
            ) : filteredRentals.length === 0 ? (
                <div className={styles.empty}>
                    <p>No hay rentas {filter !== 'all' ? getStatusLabel(filter).toLowerCase() : ''}</p>
                </div>
            ) : (
                <div className={styles.rentalsGrid}>
                    {filteredRentals.map((rental) => (
                        <div key={rental.id} className={styles.rentalCard}>
                            <div className={styles.rentalHeader}>
                                <div>
                                    <h3 className={styles.vehicleName}>
                                        {rental.car?.brand} {rental.car?.model}
                                    </h3>
                                    <p className={styles.plate}>{rental.car?.plate}</p>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusClass(rental.status)}`}>
                                    {getStatusLabel(rental.status)}
                                </span>
                            </div>

                            {rental.car?.mainPhotoUrl && (
                                <div className={styles.imageContainer}>
                                    <img
                                        src={rental.car.mainPhotoUrl}
                                        alt={`${rental.car.brand} ${rental.car.model}`}
                                        className={styles.vehicleImage}
                                    />
                                </div>
                            )}

                            <div className={styles.rentalDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Cliente:</span>
                                    <span className={styles.value}>
                                        {rental.client?.firstName} {rental.client?.lastName}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Inicio:</span>
                                    <span className={styles.value}>{formatDate(rental.startDate)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Fin Estimado:</span>
                                    <span className={styles.value}>{formatDate(rental.estimatedEndDate)}</span>
                                </div>
                                {rental.actualEndDate && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Fin Real:</span>
                                        <span className={styles.value}>{formatDate(rental.actualEndDate)}</span>
                                    </div>
                                )}
                                <div className={styles.detailRow}>
                                    <span className={styles.label}>Horas Estimadas:</span>
                                    <span className={styles.value}>{rental.estimatedHours}h</span>
                                </div>
                                {rental.actualHours && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Horas Reales:</span>
                                        <span className={styles.value}>{rental.actualHours}h</span>
                                    </div>
                                )}
                                <div className={`${styles.detailRow} ${styles.total}`}>
                                    <span className={styles.label}>Total {rental.actualTotalPrice ? 'Final' : 'Estimado'}:</span>
                                    <span className={styles.value}>
                                        {formatCurrency(rental.actualTotalPrice || rental.estimatedTotalPrice)}
                                    </span>
                                </div>
                                {rental.cancellationReason && (
                                    <div className={styles.cancellationReason}>
                                        <span className={styles.label}>Razón de Cancelación:</span>
                                        <p>{rental.cancellationReason}</p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => router.push(`/rental/${rental.id}`)}
                                >
                                    Ver Detalles
                                </Button>
                                {rental.status === RentalStatus.Pending && (
                                    <Button
                                        size="small"
                                        onClick={() => handleDeliver(rental.id)}
                                    >
                                        Entregar
                                    </Button>
                                )}
                                {rental.status === RentalStatus.Active && (
                                    <Button
                                        size="small"
                                        onClick={() => handleComplete(rental.id)}
                                    >
                                        Completar
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CompanyRentals() {
    return (
        <ProtectedRoute requireCompany>
            <CompanyRentalsPage />
        </ProtectedRoute>
    );
}
