import { Plans } from '@/mock/product';
import { formatCurrency } from '@/utils/formatNumber';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import styles from '@/styles/pages/Plans.module.scss';
import { useState } from 'react';
import axios from 'axios';

export default function PlansPage() {
    const { isCompany, company } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<number | null>(null);
    const [showTrialPlan, setShowTrialPlan] = useState(false);

    const handleSubscribe = async (plan: typeof Plans[0]) => {
        if (!isCompany) {
            router.push('/auth/register-company');
            return;
        }

        setLoading(plan.id);

        try {
            const response = await axios.post('/api/cheackout', { product: plan });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
            alert('Error al procesar el pago. Por favor intenta de nuevo.');
        } finally {
            setLoading(null);
        }
    };

    const visiblePlans = Plans.filter(plan => !plan.hidden || showTrialPlan);

    return (
        <div className={styles.plansContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Planes de Suscripción</h1>
                <p className={styles.subtitle}>
                    Elige el plan perfecto para tu empresa y empieza a rentar tus vehículos
                </p>
                <button
                    className={styles.toggleButton}
                    onClick={() => setShowTrialPlan(!showTrialPlan)}
                >
                    {showTrialPlan ? 'Ocultar' : 'Mostrar'} Plan de Prueba
                </button>
            </div>

            <div className={styles.plansGrid}>
                {visiblePlans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
                    >
                        {plan.popular && <div className={styles.badge}>Más Popular</div>}

                        <div className={styles.planHeader}>
                            <h2 className={styles.planName}>{plan.name}</h2>
                            <div className={styles.priceContainer}>
                                <span className={styles.price}>{formatCurrency(plan.price)}</span>
                                <span className={styles.period}>/ {plan.months} {plan.months === 1 ? 'mes' : 'meses'}</span>
                            </div>
                            <div className={styles.pricePerMonth}>
                                {formatCurrency(plan.pricePerMonth)} por mes
                            </div>
                        </div>

                        <ul className={styles.features}>
                            {plan.features.map((feature, index) => (
                                <li key={index} className={styles.feature}>
                                    <span className={styles.checkIcon}>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={() => handleSubscribe(plan)}
                            loading={loading === plan.id}
                            variant={plan.popular ? 'primary' : 'outline'}
                            fullWidth
                            size="large"
                            disabled={isCompany && company?.subscriptionStatus === 1}
                        >
                            {isCompany && company?.subscriptionStatus === 1
                                ? 'Ya tienes una suscripción activa'
                                : 'Suscribirse'}
                        </Button>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <div className={styles.infoBox}>
                    <h3>Pago Seguro con Mercado Pago</h3>
                    <p>
                        Todos los pagos son procesados de forma segura a través de Mercado Pago.
                        Puedes pagar con tarjeta de crédito, débito, PSE y otros métodos disponibles.
                    </p>
                </div>

                <div className={styles.infoBox}>
                    <h3>¿Necesitas ayuda para elegir?</h3>
                    <p>
                        Contáctanos en <a href="mailto:soporte@carlend.com">soporte@carlend.com</a> y
                        te ayudaremos a encontrar el plan perfecto para tu negocio.
                    </p>
                </div>
            </div>
        </div>
    );
}
