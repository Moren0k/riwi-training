import styles from '@/styles/components/Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3 className={styles.title}>Carlend</h3>
                        <p className={styles.description}>
                            Plataforma líder en renta de vehículos en Colombia
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Para Clientes</h4>
                        <ul className={styles.links}>
                            <li><a href="/catalog">Catálogo</a></li>
                            <li><a href="/auth/register-client">Registrarse</a></li>
                            <li><a href="/auth/login">Iniciar Sesión</a></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Para Empresas</h4>
                        <ul className={styles.links}>
                            <li><a href="/plans">Planes</a></li>
                            <li><a href="/auth/register-company">Registrar Empresa</a></li>
                            <li><a href="/auth/login">Acceso Empresas</a></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Soporte</h4>
                        <ul className={styles.links}>
                            <li><a href="mailto:soporte@carlend.com">Contacto</a></li>
                            <li><a href="#">Términos y Condiciones</a></li>
                            <li><a href="#">Política de Privacidad</a></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Asistente IA</h4>
                        <p className={styles.botDescription}>
                            ¿Necesitas ayuda para encontrar el vehículo perfecto?
                        </p>
                        <a
                            href="https://t.me/CarlendAssistantBot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.botButton}
                        >
                            Chatear con IA
                        </a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Carlend. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
