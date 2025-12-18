import { useState, FormEvent } from 'react';
import { Car } from '@/types';
import { rentalService } from '@/services';
import Button from '@/components/Button';
import Input from '@/components/Input';
import styles from '@/styles/components/RentalBookingModal.module.scss';

interface RentalBookingModalProps {
    vehicle: Car;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RentalBookingModal({ vehicle, onClose, onSuccess }: RentalBookingModalProps) {
    const [formData, setFormData] = useState({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateHours = () => {
        if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
            return 0;
        }

        const start = new Date(`${formData.startDate}T${formData.startTime}`);
        const end = new Date(`${formData.endDate}T${formData.endTime}`);

        const diffMs = end.getTime() - start.getTime();
        const hours = Math.ceil(diffMs / (1000 * 60 * 60));

        return hours > 0 ? hours : 0;
    };

    const estimatedHours = calculateHours();
    const estimatedPrice = estimatedHours * vehicle.basePricePerHour;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (estimatedHours <= 0) {
            setError('La fecha de fin debe ser posterior a la fecha de inicio');
            return;
        }

        if (estimatedHours < 1) {
            setError('La renta mínima es de 1 hora');
            return;
        }

        setLoading(true);

        try {
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

            await rentalService.create({
                carId: vehicle.id,
                startDate: startDateTime.toISOString().split('.')[0] + 'Z',
                estimatedEndDate: endDateTime.toISOString().split('.')[0] + 'Z',
            });

            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear la renta');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get minimum time for today
    const getMinTime = () => {
        if (formData.startDate === getMinDate()) {
            const now = new Date();
            return now.toTimeString().slice(0, 5);
        }
        return '00:00';
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Reservar Vehículo</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.vehicleInfo}>
                    <h3 className={styles.vehicleName}>
                        {vehicle.brand} {vehicle.model} {vehicle.year}
                    </h3>
                    <p className={styles.vehiclePrice}>
                        {formatCurrency(vehicle.basePricePerHour)} por hora
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.dateTimeGroup}>
                        <div className={styles.dateTimeSection}>
                            <h4 className={styles.sectionTitle}>Fecha y Hora de Inicio</h4>
                            <div className={styles.dateTimeInputs}>
                                <Input
                                    label="Fecha"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    min={getMinDate()}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label="Hora"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    min={getMinTime()}
                                    required
                                    fullWidth
                                />
                            </div>
                        </div>

                        <div className={styles.dateTimeSection}>
                            <h4 className={styles.sectionTitle}>Fecha y Hora de Fin</h4>
                            <div className={styles.dateTimeInputs}>
                                <Input
                                    label="Fecha"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    min={formData.startDate || getMinDate()}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label="Hora"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.summary}>
                        <h4 className={styles.summaryTitle}>Resumen de Reserva</h4>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Horas estimadas:</span>
                            <span className={styles.summaryValue}>{estimatedHours} horas</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Precio por hora:</span>
                            <span className={styles.summaryValue}>{formatCurrency(vehicle.basePricePerHour)}</span>
                        </div>
                        <div className={`${styles.summaryItem} ${styles.total}`}>
                            <span className={styles.summaryLabel}>Total Estimado:</span>
                            <span className={styles.summaryValue}>{formatCurrency(estimatedPrice)}</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            fullWidth
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={estimatedHours <= 0}
                            fullWidth
                        >
                            Confirmar Reserva
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
