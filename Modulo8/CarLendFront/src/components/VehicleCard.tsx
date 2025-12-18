import { Car } from '@/types';
import { formatCurrency } from '@/utils/formatNumber';
import Link from 'next/link';
import styles from '@/styles/components/VehicleCard.module.scss';

interface VehicleCardProps {
    car: Car;
}

export default function VehicleCard({ car }: VehicleCardProps) {
    return (
        <Link href={`/vehicles/${car.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {car.mainPhotoUrl ? (
                    <img src={car.mainPhotoUrl} alt={`${car.brand} ${car.model}`} className={styles.image} />
                ) : (
                    <div className={styles.placeholder}>
                        <span className={styles.placeholderIcon}>🚗</span>
                    </div>
                )}
                {!car.isAvailable && (
                    <div className={styles.unavailableBadge}>No Disponible</div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>
                    {car.brand} {car.model}
                </h3>

                <div className={styles.details}>
                    <span className={styles.detail}>📅 {car.year}</span>
                    <span className={styles.detail}>🎨 {car.color}</span>
                </div>

                {car.company && (
                    <div className={styles.company}>
                        <span className={styles.companyIcon}>🏢</span>
                        {car.company.tradeName}
                    </div>
                )}

                <div className={styles.footer}>
                    <div className={styles.price}>
                        <span className={styles.priceLabel}>Desde</span>
                        <span className={styles.priceValue}>{formatCurrency(car.basePricePerHour)}</span>
                        <span className={styles.priceUnit}>/ hora</span>
                    </div>

                    <div className={styles.cta}>
                        {car.isAvailable ? 'Ver detalles →' : 'Ver información'}
                    </div>
                </div>
            </div>
        </Link>
    );
}
