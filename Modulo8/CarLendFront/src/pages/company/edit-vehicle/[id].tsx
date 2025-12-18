import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { carService } from '@/services';
import { Car } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styles from '@/styles/pages/Auth.module.scss';

function EditVehiclePage() {
    const { company } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [vehicle, setVehicle] = useState<Car | null>(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate: '',
        color: '',
        commercialValue: 0,
        basePricePerHour: 0,
        soatExpirationDate: '',
        techExpirationDate: '',
    });
    const [mainPhoto, setMainPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(true);

    useEffect(() => {
        if (id) {
            loadVehicle();
        }
    }, [id]);

    const loadVehicle = async () => {
        try {
            setLoadingVehicle(true);
            const data = await carService.getById(Number(id));
            setVehicle(data);
            setFormData({
                brand: data.brand,
                model: data.model,
                year: data.year,
                plate: data.plate,
                color: data.color,
                commercialValue: data.commercialValue,
                basePricePerHour: data.basePricePerHour,
                soatExpirationDate: data.soatExpirationDate.split('T')[0],
                techExpirationDate: data.techExpirationDate.split('T')[0],
            });
            if (data.mainPhotoUrl) {
                setPhotoPreview(data.mainPhotoUrl);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar vehículo');
        } finally {
            setLoadingVehicle(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        setLoading(true);

        try {
            await carService.update(Number(id), {
                ...formData,
                mainPhoto: mainPhoto || undefined as any,
            });
            router.push('/company/vehicles');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar vehículo');
        } finally {
            setLoading(false);
        }
    };

    if (company?.subscriptionStatus !== 1) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h1>Suscripción Requerida</h1>
                    <p>Necesitas una suscripción activa para editar vehículos.</p>
                    <Button onClick={() => router.push('/plans')}>
                        Ver Planes
                    </Button>
                </div>
            </div>
        );
    }

    if (loadingVehicle) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <p>Cargando vehículo...</p>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h1>Vehículo no encontrado</h1>
                    <Button onClick={() => router.push('/company/vehicles')}>
                        Volver a Mis Vehículos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authContainer}>
            <div className={`${styles.authCard} ${styles.wide}`}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Editar Vehículo</h1>
                    <p className={styles.authSubtitle}>
                        Actualiza la información de tu vehículo
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGrid}>
                        <Input
                            label="Marca"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            placeholder="Toyota, Chevrolet, etc."
                            required
                            fullWidth
                        />

                        <Input
                            label="Modelo"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            placeholder="Corolla, Spark, etc."
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <Input
                            label="Año"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            required
                            fullWidth
                        />

                        <Input
                            label="Placa"
                            value={formData.plate}
                            onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                            placeholder="ABC123"
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <Input
                            label="Color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            placeholder="Blanco, Negro, etc."
                            required
                            fullWidth
                        />

                        <Input
                            label="Valor Comercial (COP)"
                            type="number"
                            value={formData.commercialValue}
                            onChange={(e) => setFormData({ ...formData, commercialValue: parseFloat(e.target.value) })}
                            placeholder="50000000"
                            required
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Precio por Hora (COP)"
                        type="number"
                        value={formData.basePricePerHour}
                        onChange={(e) => setFormData({ ...formData, basePricePerHour: parseFloat(e.target.value) })}
                        placeholder="15000"
                        required
                        fullWidth
                    />

                    <div className={styles.formGrid}>
                        <Input
                            label="Fecha de Vencimiento SOAT"
                            type="date"
                            value={formData.soatExpirationDate}
                            onChange={(e) => setFormData({ ...formData, soatExpirationDate: e.target.value })}
                            required
                            fullWidth
                        />

                        <Input
                            label="Fecha de Vencimiento Tecnomecánica"
                            type="date"
                            value={formData.techExpirationDate}
                            onChange={(e) => setFormData({ ...formData, techExpirationDate: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.fileUpload}>
                        <label className={styles.fileLabel}>
                            Foto Principal del Vehículo {!photoPreview && '*'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className={styles.fileInput}
                        />
                        {photoPreview && (
                            <div className={styles.photoPreview}>
                                <img src={photoPreview} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/company/vehicles')}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" loading={loading}>
                            Actualizar Vehículo
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EditVehicle() {
    return (
        <ProtectedRoute requireCompany>
            <EditVehiclePage />
        </ProtectedRoute>
    );
}
