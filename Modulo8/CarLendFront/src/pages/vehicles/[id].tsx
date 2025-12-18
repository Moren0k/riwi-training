import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { carService } from '@/services';
import { Car } from '@/types';
import Button from '@/components/Button';
import RentalBookingModal from '@/components/RentalBookingModal';
import styles from '@/styles/pages/VehicleDetail.module.scss';

export default function VehicleDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, isClient } = useAuth();
    const [vehicle, setVehicle] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        if (id) {
            loadVehicle();
        }
    }, [id]);

    const loadVehicle = async () => {
        try {
            setLoading(true);
            const data = await carService.getById(Number(id));
            setVehicle(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar vehículo');
        } finally {
            setLoading(false);
        }
    };

    const handleRentClick = () => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        if (!isClient) {
            alert('Solo los clientes pueden rentar vehículos');
            return;
        }
        setShowBookingModal(true);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando vehículo...</div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Vehículo no encontrado</h2>
                    <p>{error || 'El vehículo que buscas no existe'}</p>
                    <Button onClick={() => router.push('/catalog')}>
                        Volver al Catálogo
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumb}>
                <a onClick={() => router.push('/catalog')}>Catálogo</a>
                <span>/</span>
                <span>{vehicle.brand} {vehicle.model}</span>
            </div>

            <div className={styles.content}>
                {/* Image Section */}
                <div className={styles.imageSection}>
                    {vehicle.mainPhotoUrl ? (
                        <div className={styles.mainImage}>
                            <Image
                                src={vehicle.mainPhotoUrl}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.image}
                            />
                        </div>
                    ) : (
                        <div className={styles.noImage}>
                            <span>Sin imagen disponible</span>
                        </div>
                    )}

                    <div className={`${styles.availabilityBadge} ${vehicle.isAvailable ? styles.available : styles.unavailable}`}>
                        {vehicle.isAvailable ? '✓ Disponible' : '✗ No Disponible'}
                    </div>
                </div>

                {/* Details Section */}
                <div className={styles.detailsSection}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            {vehicle.brand} {vehicle.model}
                        </h1>
                        <p className={styles.year}>{vehicle.year}</p>
                    </div>

                    {/* Price */}
                    <div className={styles.priceSection}>
                        <div className={styles.priceLabel}>Precio por hora</div>
                        <div className={styles.price}>{formatCurrency(vehicle.basePricePerHour)}</div>
                    </div>

                    {/* Specifications */}
                    <div className={styles.specifications}>
                        <h2 className={styles.sectionTitle}>Especificaciones</h2>
                        <div className={styles.specsGrid}>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Marca</span>
                                <span className={styles.specValue}>{vehicle.brand}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Modelo</span>
                                <span className={styles.specValue}>{vehicle.model}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Año</span>
                                <span className={styles.specValue}>{vehicle.year}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Color</span>
                                <span className={styles.specValue}>{vehicle.color}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Placa</span>
                                <span className={styles.specValue}>{vehicle.plate}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Valor Comercial</span>
                                <span className={styles.specValue}>{formatCurrency(vehicle.commercialValue)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className={styles.documents}>
                        <h2 className={styles.sectionTitle}>Documentación</h2>
                        <div className={styles.docsGrid}>
                            <div className={styles.docItem}>
                                <span className={styles.docLabel}>SOAT</span>
                                <span className={styles.docValue}>
                                    Vence: {formatDate(vehicle.soatExpirationDate)}
                                </span>
                            </div>
                            <div className={styles.docItem}>
                                <span className={styles.docLabel}>Tecnomecánica</span>
                                <span className={styles.docValue}>
                                    Vence: {formatDate(vehicle.techExpirationDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Company Info */}
                    {vehicle.company && (
                        <div className={styles.companyInfo}>
                            <h2 className={styles.sectionTitle}>Empresa</h2>
                            <p className={styles.companyName}>{vehicle.company.tradeName}</p>
                            {vehicle.company.contactEmail && (
                                <p className={styles.companyContact}>
                                    Contacto: {vehicle.company.contactEmail}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        {vehicle.isAvailable ? (
                            <Button
                                onClick={handleRentClick}
                                size="large"
                                fullWidth
                            >
                                Rentar Ahora
                            </Button>
                        ) : (
                            <Button
                                disabled
                                size="large"
                                fullWidth
                            >
                                No Disponible
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => router.push('/catalog')}
                            size="large"
                            fullWidth
                        >
                            Volver al Catálogo
                        </Button>
                    </div>
                </div>
            </div>

            {/* Rental Booking Modal */}
            {showBookingModal && (
                <RentalBookingModal
                    vehicle={vehicle}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => {
                        setShowBookingModal(false);
                        router.push('/client/rentals');
                    }}
                />
            )}
        </div>
    );
}
