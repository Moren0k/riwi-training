import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { rentalService } from '@/services';
import { Rental } from '@/types';
import Button from '@/components/Button';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from '@/styles/pages/RentalDetail.module.scss';

function RentalDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { isClient, isCompany } = useAuth();
    const [rental, setRental] = useState<Rental | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadRental();
        }
    }, [id]);

    const loadRental = async () => {
        try {
            setLoading(true);
            const data = await rentalService.getById(Number(id));
            setRental(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar renta');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return 'Pendiente';
            case 1: return 'Activa';
            case 2: return 'Completada';
            case 3: return 'Cancelada';
            default: return 'Desconocido';
        }
    };

    const getStatusClass = (status: number) => {
        switch (status) {
            case 0: return 'pending';
            case 1: return 'active';
            case 2: return 'completed';
            case 3: return 'cancelled';
            default: return '';
        }
    };

    const handleDeliver = async () => {
        if (!confirm('¿Confirmar entrega del vehículo?')) return;

        setActionLoading(true);
        try {
            await rentalService.deliver(rental!.id);
            await loadRental();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al entregar vehículo');
        } finally {
            setActionLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!confirm('¿Confirmar finalización de la renta?')) return;

        setActionLoading(true);
        try {
            await rentalService.complete(rental!.id);
            await loadRental();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al completar renta');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        const reason = prompt('Ingresa el motivo de cancelación:');
        if (!reason) return;

        setActionLoading(true);
        try {
            await rentalService.cancel(rental!.id, { reason });
            await loadRental();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al cancelar renta');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando renta...</div>
            </div>
        );
    }

    if (error || !rental) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Renta no encontrada</h2>
                    <p>{error || 'La renta que buscas no existe'}</p>
                    <Button onClick={() => router.back()}>Volver</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Detalle de Renta #{rental.id}</h1>
                    <div className={`${styles.statusBadge} ${styles[getStatusClass(rental.status)]}`}>
                        {getStatusText(rental.status)}
                    </div>
                </div>
                <Button variant="outline" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>

            <div className={styles.content}>
                {/* Vehicle Information */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vehículo</h2>
                    <div className={styles.vehicleCard}>
                        {rental.car?.mainPhotoUrl && (
                            <div className={styles.vehicleImage}>
                                <Image
                                    src={rental.car.mainPhotoUrl}
                                    alt={`${rental.car.brand} ${rental.car.model}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        {rental.car && (
                            <div className={styles.vehicleInfo}>
                                <h3 className={styles.vehicleName}>
                                    {rental.car.brand} {rental.car.model} {rental.car.year}
                                </h3>
                                <div className={styles.vehicleDetails}>
                                    <span>Placa: {rental.car.plate}</span>
                                    <span>Color: {rental.car.color}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Client Information (for companies) */}
                {isCompany && rental.client && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Cliente</h2>
                        <div className={styles.infoCard}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Nombre:</span>
                                <span className={styles.infoValue}>
                                    {rental.client.firstName} {rental.client.lastName}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Documento:</span>
                                <span className={styles.infoValue}>{rental.client.documentNumber}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Teléfono:</span>
                                <span className={styles.infoValue}>{rental.client.primaryPhone}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Company Information (for clients) */}
                {isClient && rental.car?.company && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Empresa</h2>
                        <div className={styles.infoCard}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Nombre:</span>
                                <span className={styles.infoValue}>{rental.car.company.tradeName}</span>
                            </div>
                            {rental.car.company.contactEmail && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Email:</span>
                                    <span className={styles.infoValue}>{rental.car.company.contactEmail}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Rental Timeline */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Línea de Tiempo</h2>
                    <div className={styles.timeline}>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>📅</div>
                            <div className={styles.timelineContent}>
                                <h4>Fecha de Inicio</h4>
                                <p>{formatDateTime(rental.startDate)}</p>
                            </div>
                        </div>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>⏱️</div>
                            <div className={styles.timelineContent}>
                                <h4>Fecha Estimada de Fin</h4>
                                <p>{formatDateTime(rental.estimatedEndDate)}</p>
                            </div>
                        </div>
                        {rental.actualEndDate && (
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineIcon}>✅</div>
                                <div className={styles.timelineContent}>
                                    <h4>Fecha Real de Fin</h4>
                                    <p>{formatDateTime(rental.actualEndDate)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Information */}
                {rental.car && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Información de Precio</h2>
                        <div className={styles.pricingCard}>
                            <div className={styles.pricingRow}>
                                <span className={styles.pricingLabel}>Precio por Hora:</span>
                                <span className={styles.pricingValue}>{formatCurrency(rental.car.basePricePerHour)}</span>
                            </div>
                            <div className={styles.pricingRow}>
                                <span className={styles.pricingLabel}>Horas Estimadas:</span>
                                <span className={styles.pricingValue}>{rental.estimatedHours} horas</span>
                            </div>
                            <div className={styles.pricingRow}>
                                <span className={styles.pricingLabel}>Total Estimado:</span>
                                <span className={styles.pricingValue}>{formatCurrency(rental.estimatedTotalPrice)}</span>
                            </div>
                            {rental.actualHours !== undefined && rental.actualTotalPrice !== undefined && (
                                <>
                                    <div className={styles.divider}></div>
                                    <div className={styles.pricingRow}>
                                        <span className={styles.pricingLabel}>Horas Reales:</span>
                                        <span className={styles.pricingValue}>{rental.actualHours} horas</span>
                                    </div>
                                    <div className={`${styles.pricingRow} ${styles.total}`}>
                                        <span className={styles.pricingLabel}>Total Final:</span>
                                        <span className={styles.pricingValue}>{formatCurrency(rental.actualTotalPrice)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Cancellation Reason */}
                {rental.status === 3 && rental.cancellationReason && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Motivo de Cancelación</h2>
                        <div className={styles.cancellationCard}>
                            <p>{rental.cancellationReason}</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className={styles.actions}>
                    {isCompany && rental.status === 0 && (
                        <Button
                            onClick={handleDeliver}
                            loading={actionLoading}
                            fullWidth
                        >
                            Entregar Vehículo
                        </Button>
                    )}
                    {isCompany && rental.status === 1 && (
                        <Button
                            onClick={handleComplete}
                            loading={actionLoading}
                            fullWidth
                        >
                            Completar Renta
                        </Button>
                    )}
                    {isClient && rental.status === 0 && (
                        <Button
                            onClick={handleCancel}
                            loading={actionLoading}
                            variant="outline"
                            fullWidth
                        >
                            Cancelar Renta
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function RentalDetail() {
    return (
        <ProtectedRoute>
            <RentalDetailPage />
        </ProtectedRoute>
    );
}
