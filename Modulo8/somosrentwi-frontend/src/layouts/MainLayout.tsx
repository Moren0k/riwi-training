import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth.types";

export const MainLayout = () => {
    const { isAuthenticated, role, logout } = useAuth();

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="nav-content">
                    <Link to="/" className="nav-brand">
                        SomosRentWi
                    </Link>

                    <div className="nav-links">
                        <Link to="/cars">Vehículos</Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login">Iniciar Sesión</Link>
                                <Link to="/register">Registrarse</Link>
                            </>
                        ) : (
                            <>
                                {role === UserRole.Client && (
                                    <>
                                        <Link to="/client/dashboard">Dashboard</Link>
                                        <Link to="/client/rentals/new">Nueva Renta</Link>
                                    </>
                                )}

                                {role === UserRole.Company && (
                                    <Link to="/company/dashboard">Dashboard</Link>
                                )}

                                {role === UserRole.Admin && (
                                    <Link to="/admin/dashboard">Dashboard</Link>
                                )}

                                <button onClick={logout} className="logout-btn">
                                    Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <p>&copy; 2024 SomosRentWi. All rights reserved.</p>
            </footer>
        </div>
    );
};


