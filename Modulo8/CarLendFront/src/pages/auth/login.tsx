import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import Input from '@/components/Input';
import Button from '@/components/Button';
import styles from '@/styles/pages/Auth.module.scss';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setShowRegisterPrompt(false);
        setLoading(true);

        try {
            const response = await authService.login(formData);
            console.log('Login response structure:', JSON.stringify(response, null, 2));

            // Helper to parse JWT
            const parseJwt = (token: string) => {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    return JSON.parse(jsonPayload);
                } catch (e) {
                    return {};
                }
            };

            // Try to get role from user object or token
            let userRole = response.user?.role;

            if (!userRole && response.token) {
                const decoded = parseJwt(response.token);
                console.log('Decoded Token:', decoded);
                // Common claim names for role
                userRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
            }

            console.log('Detected Role:', userRole);

            // Update auth context with enriched user data if needed
            if (response.user && !response.user.role && userRole) {
                response.user.role = userRole;
            }

            login(response);

            // Redirect based on user type or role
            // Normalize role comparison (case-insensitive)
            const role = String(userRole).toLowerCase();

            if (response.company || role === 'company' || role === 'admin') {
                console.log('Redirecting to company dashboard');
                router.push('/company/dashboard');
            } else if (response.client || role === 'client' || role === 'user') {
                console.log('Redirecting to client dashboard');
                router.push('/client/dashboard');
            } else {
                console.log('Redirecting to home (Unknown role)', userRole);
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
            setShowRegisterPrompt(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Iniciar Sesión</h1>
                    <p className={styles.authSubtitle}>
                        Bienvenido de vuelta a Carlend
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                            {showRegisterPrompt && (
                                <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                                    <span style={{ color: 'white' }}>¿No tienes cuenta? </span>
                                    <Link href="/auth/register-client" style={{ color: '#4ade80', textDecoration: 'underline' }}>
                                        Regístrate aquí con datos automáticos
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <Input
                        id="email"
                        name="email"
                        label="Correo Electrónico"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@email.com"
                        required
                        fullWidth
                    />

                    <Input
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        fullWidth
                    />

                    <Button type="submit" loading={loading} fullWidth size="large">
                        Iniciar Sesión
                    </Button>
                </form>

                <div className={styles.authFooter}>
                    <p>
                        ¿No tienes cuenta?{' '}
                        <Link href="/auth/register-client" className={styles.link}>
                            Regístrate como cliente
                        </Link>
                    </p>
                    <p>
                        ¿Eres una empresa?{' '}
                        <Link href="/auth/register-company" className={styles.link}>
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
