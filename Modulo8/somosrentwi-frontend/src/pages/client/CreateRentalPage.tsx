import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CarsService } from "../../services/cars.service";
import { RentalsService } from "../../services/rentals.service";
import type { Car } from "../../types/models.types";

export const CreateRentalPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCarId, setSelectedCarId] = useState<number>(location.state?.carId || 0);
    const [startDate, setStartDate] = useState("");
    const [estimatedEndDate, setEstimatedEndDate] = useState("");
    const [loading, setLoading] = useState(false);
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
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await RentalsService.create({
                carId: selectedCarId,
                startDate: new Date(startDate).toISOString(),
                estimatedEndDate: new Date(estimatedEndDate).toISOString(),
            });

            alert("Rental created successfully!");
            navigate("/client/rentals");
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Failed to create rental";
            setError(errorMsg);

            // Check if it's a verification status error
            if (errorMsg.includes("verification") || errorMsg.includes("Accepted")) {
                setError("Your account must be verified and accepted by an administrator before you can create rentals.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-card">
                <h1>Create New Rental</h1>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="carId">Select Car</label>
                        <select
                            id="carId"
                            value={selectedCarId}
                            onChange={(e) => setSelectedCarId(parseInt(e.target.value))}
                            required
                        >
                            <option value={0}>-- Select a car --</option>
                            {cars.map((car) => (
                                <option key={car.id} value={car.id}>
                                    {car.brand} {car.model} ({car.year}) - ${car.basePricePerHour}/hour
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            id="startDate"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="estimatedEndDate">Estimated End Date</label>
                        <input
                            id="estimatedEndDate"
                            type="datetime-local"
                            value={estimatedEndDate}
                            onChange={(e) => setEstimatedEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Creating..." : "Create Rental"}
                    </button>
                </form>
            </div>
        </div>
    );
};
