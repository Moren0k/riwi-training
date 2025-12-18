export const LandingPage = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>SomosRentWi</h1>
                    <p>
                        La plataforma digital que revoluciona el alquiler de vehículos,
                        conectando empresas de renta con clientes de manera eficiente y transparente.
                    </p>
                    <a href="/cars">
                        <button className="cta-button">Explorar Vehículos</button>
                    </a>
                </div>
            </section>

            {/* The Problem */}
            <section className="section">
                <h2 className="section-title">El Problema</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3>Procesos Manuales</h3>
                        <p>Gestión tradicional con papelería y procesos lentos que generan ineficiencia operativa.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👁️</div>
                        <h3>Baja Visibilidad</h3>
                        <p>Empresas de renta con poca presencia digital, limitando su alcance de mercado.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⏱️</div>
                        <h3>Tiempo Perdido</h3>
                        <p>Clientes pierden tiempo buscando opciones confiables y comparando precios manualmente.</p>
                    </div>
                </div>
            </section>

            {/* The Solution */}
            <section className="section" style={{ backgroundColor: '#f9fafb' }}>
                <h2 className="section-title">La Solución</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚗</div>
                        <h3>Catálogo Digital</h3>
                        <p>Plataforma centralizada donde clientes pueden explorar y comparar vehículos disponibles.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Automatización</h3>
                        <p>Gestión automatizada de reservas, verificación de clientes y seguimiento de rentas.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Gestión Financiera</h3>
                        <p>Sistema de billeteras digitales con distribución automática de pagos (90% empresa, 10% plataforma).</p>
                    </div>
                </div>
            </section>

            {/* Who is it for */}
            <section className="section">
                <h2 className="section-title">¿Para Quién?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🏢</div>
                        <h3>Empresas de Renta</h3>
                        <p>
                            Gestiona tu flota, procesa rentas, y recibe pagos automáticamente.
                            Aumenta tu visibilidad y alcanza más clientes.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👤</div>
                        <h3>Clientes</h3>
                        <p>
                            Explora vehículos, compara precios, y reserva de forma rápida y segura.
                            Proceso de verificación simple y transparente.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="section" style={{ backgroundColor: '#f9fafb' }}>
                <h2 className="section-title">Planes de Suscripción</h2>
                <div className="pricing-table">
                    <div className="pricing-card">
                        <h3>Free</h3>
                        <div className="price">
                            $0<span className="price-period">/mes</span>
                        </div>
                        <ul className="features-list">
                            <li>Hasta 5 vehículos</li>
                            <li>Gestión básica de rentas</li>
                            <li>Soporte por email</li>
                        </ul>
                    </div>

                    <div className="pricing-card">
                        <h3>Starter</h3>
                        <div className="price">
                            $29<span className="price-period">/mes</span>
                        </div>
                        <ul className="features-list">
                            <li>Hasta 15 vehículos</li>
                            <li>Reportes básicos</li>
                            <li>Soporte prioritario</li>
                        </ul>
                    </div>

                    <div className="pricing-card featured">
                        <h3>Business</h3>
                        <div className="price">
                            $79<span className="price-period">/mes</span>
                        </div>
                        <ul className="features-list">
                            <li>Hasta 50 vehículos</li>
                            <li>Reportes avanzados</li>
                            <li>API access</li>
                            <li>Soporte 24/7</li>
                        </ul>
                    </div>

                    <div className="pricing-card">
                        <h3>Pro</h3>
                        <div className="price">
                            $149<span className="price-period">/mes</span>
                        </div>
                        <ul className="features-list">
                            <li>Hasta 100 vehículos</li>
                            <li>Analytics avanzados</li>
                            <li>Integraciones personalizadas</li>
                            <li>Account manager dedicado</li>
                        </ul>
                    </div>

                    <div className="pricing-card">
                        <h3>Enterprise</h3>
                        <div className="price">
                            Custom<span className="price-period"></span>
                        </div>
                        <ul className="features-list">
                            <li>Vehículos ilimitados</li>
                            <li>Solución personalizada</li>
                            <li>SLA garantizado</li>
                            <li>Soporte dedicado</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="section">
                <h2 className="section-title">Tecnología Moderna</h2>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    Construido con las mejores tecnologías para garantizar rendimiento, seguridad y escalabilidad.
                </p>
                <div className="tech-stack">
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">TypeScript</span>
                    <span className="tech-badge">.NET Core</span>
                    <span className="tech-badge">MySQL</span>
                    <span className="tech-badge">JWT Auth</span>
                    <span className="tech-badge">Cloudinary</span>
                    <span className="tech-badge">Railway</span>
                    <span className="tech-badge">Clean Architecture</span>
                </div>
            </section>

            {/* CTA Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h2 style={{ color: 'white' }}>¿Listo para comenzar?</h2>
                    <p>Únete a SomosRentWi y transforma la manera de rentar vehículos.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="/register">
                            <button className="cta-button">Registrarse como Cliente</button>
                        </a>
                        <a href="/login">
                            <button className="cta-button">Iniciar Sesión</button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
