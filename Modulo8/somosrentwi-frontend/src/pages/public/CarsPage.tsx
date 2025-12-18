import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CarsService } from "../../services/cars.service";
import type { Car } from "../../types/models.types";

export const CarsPage = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            const data = await CarsService.getAll();
            setCars(data);
        } catch (err: any) {
            setError("Failed to load cars");
        } finally {
            setLoading(false);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.display = 'none';
        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    };

    if (loading) return <div className="page-container">Loading cars...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Catálogo de Vehículos</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        Explora nuestra selección de vehículos disponibles para renta
                    </p>
                </div>
            </div>

            <div className="cars-grid">
                {cars.length === 0 ? (
                    <p>No hay vehículos disponibles en este momento.</p>
                ) : (
                    cars.map((car) => (
                        <div key={car.id} className="car-card">
                            <img
                                src={car.mainPhotoUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                                alt={`${car.brand} ${car.model}`}
                                className="car-image"
                                onError={handleImageError}
                            />
                            <div className="car-info">
                                <h3>{car.brand} {car.model}</h3>
                                <p className="car-year">{car.year}</p>
                                <p className="car-price">${car.basePricePerHour}/hora</p>
                                <Link to={`/cars/${car.id}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                    Ver Detalles
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
