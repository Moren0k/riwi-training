import { ClientStats } from '@/types';
import { formatCurrency } from '@/utils/formatNumber';
import styles from '@/styles/components/Stats.module.scss';

interface ClientStatsProps {
    stats: ClientStats;
}

export default function ClientStatsCard({ stats }: ClientStatsProps) {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.iconContainer}>🚗</div>
                <div className={styles.content}>
                    <div className={styles.label}>Total Rentas</div>
                    <div className={styles.value}>{stats.totalRentals}</div>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.highlight}`}>
                <div className={styles.iconContainer}>🔑</div>
                <div className={styles.content}>
                    <div className={styles.label}>Rentas Activas</div>
                    <div className={styles.value}>{stats.activeRentals}</div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.iconContainer}>✅</div>
                <div className={styles.content}>
                    <div className={styles.label}>Completadas</div>
                    <div className={styles.value}>{stats.completedRentals}</div>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.iconContainer}>💰</div>
                <div className={styles.content}>
                    <div className={styles.label}>Total Invertido</div>
                    <div className={styles.value}>{formatCurrency(stats.totalSpent)}</div>
                </div>
            </div>
        </div>
    );
}
