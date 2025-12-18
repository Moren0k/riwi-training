import { Link } from "react-router-dom";

export const ClientDashboard = () => {
    return (
        <div className="page-container">
            <div className="dashboard-header">
                <h1>Panel de Cliente</h1>
                <p>¡Bienvenido de nuevo!</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Acciones Rápidas</h3>
                    <ul className="action-list">
                        <li><Link to="/client/rentals/new">Crear Nueva Renta</Link></li>
                        <li><Link to="/client/rentals">Ver Mis Rentas</Link></li>
                        <li><Link to="/cars">Explorar Vehículos</Link></li>
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h3>Estado de Cuenta</h3>
                    <p>Tu cuenta está activa. Puedes crear rentas una vez que un administrador verifique tu cuenta.</p>
                </div>
            </div>
        </div>
    );
};

