import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from '@/styles/pages/ClientProfileStyles.module.scss';
import Image from 'next/image';

function ClientProfileContent() {
    const { client, user } = useAuth();

    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <div className={styles.avatar}>
                        {client?.selfiePhotoUrl ? (
                            <Image
                                src={client.selfiePhotoUrl}
                                alt="Profile"
                                width={100}
                                height={100}
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            <span className={styles.avatarInitial}>
                                {client?.firstName?.charAt(0) || user.email?.charAt(0)}
                            </span>
                        )}
                    </div>
                    <h1>{client ? `${client.firstName} ${client.lastName}` : 'Mi Perfil'}</h1>
                    <p className={styles.role}>Cliente</p>
                </div>

                <div className={styles.infoSection}>
                    <h2>Información Personal</h2>
                    <div className={styles.grid}>
                        <div className={styles.infoItem}>
                            <label>Email</label>
                            <span>{user.email}</span>
                        </div>
                        {client && (
                            <>
                                <div className={styles.infoItem}>
                                    <label>Teléfono</label>
                                    <span>{client.primaryPhone}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Dirección</label>
                                    <span>{client.address}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <label>Documento</label>
                                    <span>{client.documentNumber}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <h3>Rentas Activas</h3>
                        <p>0</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Total Gastado</h3>
                        <p>$0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ClientProfile() {
    return (
        <ProtectedRoute>
            <ClientProfileContent />
        </ProtectedRoute>
    );
}
