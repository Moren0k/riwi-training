import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Home.module.scss';

export default function Home() {
  const { isAuthenticated, isClient, isCompany } = useAuth();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Alquila tu auto
            <br />
            <span className={styles.gradient}>fácil y rápido</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Encuentra el vehículo ideal en segundos. Conectamos empresas de renta de vehículos con clientes en toda Colombia.
          </p>
          <div className={styles.heroButtons}>
            {!isAuthenticated ? (
              <>
                <Link href="/catalog" className={styles.primaryButton}>
                  Buscar vehículo
                </Link>
                <Link href="/plans" className={styles.secondaryButton}>
                  Ver catálogo
                </Link>
              </>
            ) : isClient ? (
              <Link href="/catalog" className={styles.primaryButton}>
                Explorar Vehículos
              </Link>
            ) : (
              <Link href="/company/dashboard" className={styles.primaryButton}>
                Ir al Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.carImageContainer}>
            <div className={styles.glowEffect}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>¿Por qué elegir Carlend?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Amplio Catálogo</h3>
            <p className={styles.featureDescription}>
              Encuentra vehículos de múltiples empresas en un solo lugar
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Pago Seguro</h3>
            <p className={styles.featureDescription}>
              Procesamos pagos de forma segura con Mercado Pago
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Proceso Rápido</h3>
            <p className={styles.featureDescription}>
              Renta un vehículo en minutos con nuestro sistema simplificado
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Para Empresas</h3>
            <p className={styles.featureDescription}>
              Gestiona tu flota y llega a más clientes con nuestros planes
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section for Companies */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Tienes una empresa de renta de vehículos?</h2>
          <p className={styles.ctaDescription}>
            Únete a Carlend y expande tu negocio. Publica tus vehículos y llega a miles de clientes potenciales.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/plans" className={styles.ctaPrimary}>
              Ver Planes
            </Link>
            <Link href="/auth/register-company" className={styles.ctaSecondary}>
              Registrar Empresa
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Cómo Funciona</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Regístrate</h3>
            <p className={styles.stepDescription}>
              Crea tu cuenta como cliente o empresa en minutos
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Explora</h3>
            <p className={styles.stepDescription}>
              Busca y filtra vehículos según tus necesidades
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Renta</h3>
            <p className={styles.stepDescription}>
              Completa el proceso de renta de forma segura
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3 className={styles.stepTitle}>Disfruta</h3>
            <p className={styles.stepDescription}>
              Recoge tu vehículo y empieza tu aventura
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
