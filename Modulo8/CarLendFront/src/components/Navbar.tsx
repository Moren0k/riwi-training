import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '@/styles/components/Navbar.module.scss';
import { CSSProperties } from 'react';

export default function Navbar() {
    const { isAuthenticated, isClient, isCompany, logout, company, client, user, loading } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getUserDisplayName = () => {
        if (isCompany && company) {
            return company.tradeName;
        }
        if (isClient && client) {
            return `${client.firstName} ${client.lastName}`;
        }
        return user?.email || 'Usuario';
    };

    const logoStyle: CSSProperties = { width: '40px', height: 'auto' };

    // Don't render auth-dependent content while loading
    if (loading) {
        return (
            <nav className={styles.navbar}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/assets/CarLendRealOne.png"
                            alt="Carlend Logo"
                            width={40}
                            height={40}
                            className={styles.logoImage}
                            style={logoStyle}
                            priority
                        />
                        <span className={styles.logoText}>Carlend</span>
                    </Link>
                    <div className={styles.nav}>
                        <Link href="/catalog" className={styles.navLink}>
                            Catálogo
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/assets/CarLendRealOne.png"
                        alt="Carlend Logo"
                        width={40}
                        height={40}
                        className={styles.logoImage}
                        style={logoStyle}
                        priority
                    />
                    <span className={styles.logoText}>Carlend</span>
                </Link>

                <div className={styles.nav}>
                    <Link href="/catalog" className={styles.navLink}>
                        Catálogo
                    </Link>

                    {!isAuthenticated && (
                        <>
                            <Link href="/plans" className={styles.navLink}>
                                Planes
                            </Link>
                            <Link href="/auth/login" className={styles.navLink}>
                                Iniciar Sesión
                            </Link>
                            <Link href="/auth/register-client" className={styles.navButton}>
                                Registrarse
                            </Link>
                        </>
                    )}

                    {isAuthenticated && (
                        <>
                            {isClient && (
                                <>
                                    <Link href="/client/rentals" className={styles.navLink}>
                                        Mis Rentas
                                    </Link>
                                    <Link href="/client/profile" className={styles.navLink}>
                                        Mi Perfil
                                    </Link>
                                    <Link href="/client/dashboard" className={styles.navLink}>
                                        Dashboard
                                    </Link>
                                </>
                            )}

                            {isCompany && (
                                <>
                                    {company?.subscriptionStatus === 1 ? (
                                        <>
                                            <Link href="/company/vehicles" className={styles.navLink}>
                                                Mis Vehículos
                                            </Link>
                                            <Link href="/company/rentals" className={styles.navLink}>
                                                Rentas
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href="/plans" className={styles.navLink}>
                                            Suscribirse
                                        </Link>
                                    )}
                                    <Link href="/company/dashboard" className={styles.navLink}>
                                        Dashboard
                                    </Link>
                                </>
                            )}

                            <div className={styles.userMenu}>
                                <span className={styles.userName}>{getUserDisplayName()}</span>
                                <button onClick={handleLogout} className={styles.logoutButton}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
