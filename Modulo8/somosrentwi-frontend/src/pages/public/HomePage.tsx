import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CarsService } from "../../services/cars.service";
import type { Car } from "../../types/models.types";

export const HomePage = () => {
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

    if (loading) return <div className="page-container">Loading cars...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Available Cars</h1>
                <p>Browse our fleet of rental cars</p>
            </div>

            <div className="cars-grid">
                {cars.length === 0 ? (
                    <p>No cars available at the moment.</p>
                ) : (
                    cars.map((car) => (
                        <div key={car.id} className="car-card">
                            <img
                                src={car.mainPhotoUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                                alt={`${car.brand} ${car.model}`}
                                className="car-image"
                            />
                            <div className="car-info">
                                <h3>{car.brand} {car.model}</h3>
                                <p className="car-year">{car.year}</p>
                                <p className="car-price">${car.basePricePerHour}/hour</p>
                                <Link to={`/cars/${car.id}`} className="btn-secondary">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

