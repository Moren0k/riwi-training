import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { CompanyPlan } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styles from '@/styles/pages/Auth.module.scss';

export default function RegisterCompany() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        tradeName: '',
        nitNumber: '',
        contactEmail: '',
        landlineNumber: '',
        mobilePhone: '',
        address: '',
        website: '',
        companyPlan: CompanyPlan.None,
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authService.registerCompany(registerData);
            login(response);
            router.push('/plans'); // Redirect to plans page to subscribe
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={`${styles.authCard} ${styles.wide}`}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Registro de Empresa</h1>
                    <p className={styles.authSubtitle}>
                        Únete a Carlend y empieza a rentar tus vehículos
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGrid}>
                        <Input
                            label="Razón Social"
                            value={formData.tradeName}
                            onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                            placeholder="Nombre de tu empresa"
                            required
                            fullWidth
                        />

                        <Input
                            label="NIT"
                            value={formData.nitNumber}
                            onChange={(e) => setFormData({ ...formData, nitNumber: e.target.value })}
                            placeholder="123456789-0"
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <Input
                            label="Correo de Contacto"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            placeholder="contacto@empresa.com"
                            required
                            fullWidth
                        />

                        <Input
                            label="Teléfono Fijo"
                            type="tel"
                            value={formData.landlineNumber}
                            onChange={(e) => setFormData({ ...formData, landlineNumber: e.target.value })}
                            placeholder="601 234 5678"
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <Input
                            label="Teléfono Móvil"
                            type="tel"
                            value={formData.mobilePhone}
                            onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
                            placeholder="300 123 4567"
                            required
                            fullWidth
                        />

                        <Input
                            label="Sitio Web"
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://tuempresa.com"
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Dirección"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Dirección completa de tu empresa"
                        required
                        fullWidth
                    />

                    <div className={styles.divider}></div>

                    <Input
                        label="Correo Electrónico (Para acceso a la plataforma)"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@empresa.com"
                        required
                        fullWidth
                    />

                    <div className={styles.formGrid}>
                        <Input
                            label="Contraseña"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            fullWidth
                        />

                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.infoBox}>
                        <p>
                            💡 Después del registro, serás redirigido a la página de planes para seleccionar tu suscripción y comenzar a publicar vehículos.
                        </p>
                    </div>

                    <Button type="submit" loading={loading} fullWidth size="large">
                        Registrar Empresa
                    </Button>
                </form>

                <div className={styles.authFooter}>
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/auth/login" className={styles.link}>
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
