import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CarsService } from "../../services/cars.service";
import type { Car } from "../../types/models.types";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/auth.types";

export const CarDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadCar(parseInt(id));
        }
    }, [id]);

    const loadCar = async (carId: number) => {
        try {
            const data = await CarsService.getById(carId);
            setCar(data);
        } catch (err: any) {
            setError("Failed to load car details");
        } finally {
            setLoading(false);
        }
    };

    const handleRentClick = () => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (role === UserRole.Client) {
            navigate("/client/rentals/new", { state: { carId: car?.id } });
        }
    };



    if (loading) return <div className="page-container">Cargando...</div>;
    if (error || !car) return <div className="page-container error-message">{error || "Vehículo no encontrado"}</div>;

    return (
        <div className="page-container">
            <div className="car-details">
                <div>
                    <img
                        src={car.mainPhotoUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
                        alt={`${car.brand} ${car.model}`}
                        className="car-detail-image"
                    />
                </div>

                <div className="car-detail-info">
                    <h1>{car.brand} {car.model}</h1>
                    <p className="car-year" style={{ fontSize: '1.125rem', marginTop: '0.5rem' }}>
                        Año: {car.year}
                    </p>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Placa: {car.plate} | Color: {car.color}
                    </p>

                    <div className="car-pricing">
                        <h3>Precio</h3>
                        <p className="price-highlight">${car.basePricePerHour}/hora</p>
                        <p style={{ color: '#6b7280' }}>Valor Comercial: ${car.commercialValue.toLocaleString()}</p>
                    </div>

                    <div className="car-documents">
                        <h3>Documentación</h3>
                        <p>SOAT Vence: {new Date(car.soatExpirationDate).toLocaleDateString('es-ES')}</p>
                        <p>Tecnomecánica Vence: {new Date(car.techExpirationDate).toLocaleDateString('es-ES')}</p>
                    </div>

                    {role === UserRole.Client && (
                        <button onClick={handleRentClick} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                            Rentar Este Vehículo
                        </button>
                    )}

                    {!isAuthenticated && (
                        <button onClick={handleRentClick} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
                            Iniciar Sesión para Rentar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
