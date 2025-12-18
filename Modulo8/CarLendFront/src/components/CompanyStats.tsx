import { CompanyStats } from '@/types';
import { formatCurrency } from '@/utils/formatNumber';
import styles from '@/styles/components/Stats.module.scss';

interface CompanyStatsProps {
    stats: CompanyStats;
}

export default function CompanyStatsCard({ stats }: CompanyStatsProps) {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.iconContainer}>🚙</div>
                <div className={styles.content}>
                    <div className={styles.label}>Total Vehículos</div>
                    <div className={styles.value}>{stats.totalVehicles}</div>
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
                    <div className={styles.label}>Ingresos Totales</div>
                    <div className={styles.value}>{formatCurrency(stats.totalRevenue)}</div>
                </div>
            </div>
        </div>
    );
}
