import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { carService } from '@/services';
import { Car } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import styles from '@/styles/pages/Vehicles.module.scss';

function VehiclesPage() {
    const { company } = useAuth();
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const data = await carService.getMyCars();
            setVehicles(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar vehículos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

        try {
            await carService.delete(id);
            setVehicles(vehicles.filter(v => v.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al eliminar vehículo');
        }
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        if (filter === 'available') return vehicle.isAvailable;
        if (filter === 'unavailable') return !vehicle.isAvailable;
        return true;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    if (company?.subscriptionStatus !== 1) {
        return (
            <div className={styles.container}>
                <div className={styles.noSubscription}>
                    <h1>Suscripción Requerida</h1>
                    <p>Necesitas una suscripción activa para gestionar vehículos.</p>
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
                    <h1 className={styles.title}>Mis Vehículos</h1>
                    <p className={styles.subtitle}>
                        Gestiona tu flota de vehículos disponibles para renta
                    </p>
                </div>
                <Button onClick={() => router.push('/company/add-vehicle')}>
                    Agregar Vehículo
                </Button>
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todos ({vehicles.length})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'available' ? styles.active : ''}`}
                    onClick={() => setFilter('available')}
                >
                    Disponibles ({vehicles.filter(v => v.isAvailable).length})
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'unavailable' ? styles.active : ''}`}
                    onClick={() => setFilter('unavailable')}
                >
                    No Disponibles ({vehicles.filter(v => !v.isAvailable).length})
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Cargando vehículos...</div>
            ) : filteredVehicles.length === 0 ? (
                <div className={styles.empty}>
                    <p>No tienes vehículos registrados</p>
                    <Button onClick={() => router.push('/company/add-vehicle')}>
                        Agregar tu primer vehículo
                    </Button>
                </div>
            ) : (
                <div className={styles.vehiclesGrid}>
                    {filteredVehicles.map((vehicle) => (
                        <div key={vehicle.id} className={styles.vehicleCard}>
                            <div className={styles.imageContainer}>
                                {vehicle.mainPhotoUrl ? (
                                    <img
                                        src={vehicle.mainPhotoUrl}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className={styles.vehicleImage}
                                    />
                                ) : (
                                    <div className={styles.noImage}>Sin imagen</div>
                                )}
                                <div className={`${styles.statusBadge} ${vehicle.isAvailable ? styles.available : styles.unavailable}`}>
                                    {vehicle.isAvailable ? 'Disponible' : 'No Disponible'}
                                </div>
                            </div>

                            <div className={styles.vehicleInfo}>
                                <h3 className={styles.vehicleName}>
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                                <p className={styles.vehicleYear}>{vehicle.year}</p>

                                <div className={styles.details}>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Placa:</span>
                                        <span className={styles.value}>{vehicle.plate}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Color:</span>
                                        <span className={styles.value}>{vehicle.color}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Precio/Hora:</span>
                                        <span className={styles.value}>{formatCurrency(vehicle.basePricePerHour)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Valor Comercial:</span>
                                        <span className={styles.value}>{formatCurrency(vehicle.commercialValue)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>SOAT:</span>
                                        <span className={styles.value}>{formatDate(vehicle.soatExpirationDate)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Tecno:</span>
                                        <span className={styles.value}>{formatDate(vehicle.techExpirationDate)}</span>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => router.push(`/company/edit-vehicle/${vehicle.id}`)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => handleDelete(vehicle.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Vehicles() {
    return (
        <ProtectedRoute requireCompany>
            <VehiclesPage />
        </ProtectedRoute>
    );
}
