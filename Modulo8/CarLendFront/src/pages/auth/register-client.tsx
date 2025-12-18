import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { ClientDocumentType } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styles from '@/styles/pages/Auth.module.scss';

export default function RegisterClient() {
    const router = useRouter();
    const { login } = useAuth();
    // Generate random unique data for testing
    const randomId = Math.floor(Math.random() * 1000000);
    const [formData, setFormData] = useState({
        email: `test${randomId}@gmail.com`,
        password: 'Admin123!',
        confirmPassword: 'Admin123!',
        firstName: 'TestUser',
        lastName: 'Automated',
        documentType: ClientDocumentType.CedulaCiudadania,
        documentNumber: `10${randomId}`, // Ensure 8-10 digits
        birthDate: '1990-01-01',
        primaryPhone: `300${randomId}`,
        address: 'Calle 123 # 45-67',
    });

    const [files, setFiles] = useState<{
        selfiePhoto: File | null;
        documentFront: File | null;
        documentBack: File | null;
        licenseFront: File | null;
        licenseBack: File | null;
    }>({
        selfiePhoto: null,
        documentFront: null,
        documentBack: null,
        licenseFront: null,
        licenseBack: null,
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files, [fieldName]: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!files.selfiePhoto || !files.documentFront || !files.documentBack ||
            !files.licenseFront || !files.licenseBack) {
            setError('Todos los archivos son requeridos');
            return;
        }

        setLoading(true);

        try {
            const registerData = {
                ...formData,
                selfiePhoto: files.selfiePhoto,
                documentFront: files.documentFront,
                documentBack: files.documentBack,
                licenseFront: files.licenseFront,
                licenseBack: files.licenseBack,
            };

            const response = await authService.registerClient(registerData);
            login(response);
            router.push('/client/dashboard');
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
                    <h1 className={styles.authTitle}>Registro de Cliente</h1>
                    <p className={styles.authSubtitle}>
                        Completa tus datos para empezar a rentar vehículos
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGrid}>
                        <Input
                            label="Nombre"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            fullWidth
                        />

                        <Input
                            label="Apellido"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.inputWrapper}>
                            <label className={styles.label}>Tipo de Documento</label>
                            <select
                                className={styles.select}
                                value={formData.documentType}
                                onChange={(e) => setFormData({ ...formData, documentType: parseInt(e.target.value) })}
                                required
                            >
                                <option value={ClientDocumentType.CedulaCiudadania}>Cédula de Ciudadanía</option>
                                <option value={ClientDocumentType.CedulaExtranjeria}>Cédula de Extranjería</option>
                            </select>
                        </div>

                        <Input
                            label="Número de Documento"
                            value={formData.documentNumber}
                            onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.formGrid}>
                        <Input
                            label="Fecha de Nacimiento"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            required
                            fullWidth
                        />

                        <Input
                            label="Teléfono"
                            type="tel"
                            value={formData.primaryPhone}
                            onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Dirección"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        fullWidth
                    />

                    <Input
                        label="Correo Electrónico"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        fullWidth
                    />

                    <div className={styles.formGrid}>
                        <Input
                            label="Contraseña"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            fullWidth
                        />

                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>

                    <div className={styles.fileSection}>
                        <h3 className={styles.sectionTitle}>Documentos Requeridos</h3>
                        <p className={styles.sectionSubtitle}>
                            Por favor sube fotos claras de tus documentos
                        </p>

                        <div className={styles.fileGrid}>
                            <div className={styles.fileInput}>
                                <label className={styles.fileLabel}>
                                    📸 Foto Selfie
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'selfiePhoto')}
                                        required
                                    />
                                    {files.selfiePhoto && <span className={styles.fileName}>{files.selfiePhoto.name}</span>}
                                </label>
                            </div>

                            <div className={styles.fileInput}>
                                <label className={styles.fileLabel}>
                                    🪪 Documento (Frente)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'documentFront')}
                                        required
                                    />
                                    {files.documentFront && <span className={styles.fileName}>{files.documentFront.name}</span>}
                                </label>
                            </div>

                            <div className={styles.fileInput}>
                                <label className={styles.fileLabel}>
                                    🪪 Documento (Reverso)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'documentBack')}
                                        required
                                    />
                                    {files.documentBack && <span className={styles.fileName}>{files.documentBack.name}</span>}
                                </label>
                            </div>

                            <div className={styles.fileInput}>
                                <label className={styles.fileLabel}>
                                    🚗 Licencia (Frente)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'licenseFront')}
                                        required
                                    />
                                    {files.licenseFront && <span className={styles.fileName}>{files.licenseFront.name}</span>}
                                </label>
                            </div>

                            <div className={styles.fileInput}>
                                <label className={styles.fileLabel}>
                                    🚗 Licencia (Reverso)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'licenseBack')}
                                        required
                                    />
                                    {files.licenseBack && <span className={styles.fileName}>{files.licenseBack.name}</span>}
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" loading={loading} fullWidth size="large">
                        Registrarse
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
