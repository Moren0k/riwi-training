import { useState, useEffect, type FormEvent } from "react";
import { CarsService } from "../../services/cars.service";
import type { Car } from "../../types/models.types";

export const CompanyCarsPage = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        plate: "",
        color: "",
        commercialValue: 0,
        basePricePerHour: 0,
        soatExpirationDate: "",
        techExpirationDate: "",
    });

    const [mainPhoto, setMainPhoto] = useState<File | null>(null);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            const data = await CarsService.getMyCars();
            setCars(data);
        } catch (err: any) {
            setError("Failed to load cars");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMainPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value.toString());
            });

            if (mainPhoto) {
                formDataToSend.append("mainPhoto", mainPhoto);
            }

            if (editingCar) {
                await CarsService.update(editingCar.id, formDataToSend);
            } else {
                await CarsService.create(formDataToSend);
            }

            setShowForm(false);
            setEditingCar(null);
            resetForm();
            loadCars();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to save car");
        }
    };

    const handleEdit = (car: Car) => {
        setEditingCar(car);
        setFormData({
            brand: car.brand,
            model: car.model,
            year: car.year,
            plate: car.plate,
            color: car.color,
            commercialValue: car.commercialValue,
            basePricePerHour: car.basePricePerHour,
            soatExpirationDate: car.soatExpirationDate.split('T')[0],
            techExpirationDate: car.techExpirationDate.split('T')[0],
        });
        setShowForm(true);
    };

    const handleDelete = async (carId: number) => {
        if (!confirm("Are you sure you want to delete this car?")) return;

        try {
            await CarsService.delete(carId);
            loadCars();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to delete car");
        }
    };

    const resetForm = () => {
        setFormData({
            brand: "",
            model: "",
            year: new Date().getFullYear(),
            plate: "",
            color: "",
            commercialValue: 0,
            basePricePerHour: 0,
            soatExpirationDate: "",
            techExpirationDate: "",
        });
        setMainPhoto(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCar(null);
        resetForm();
    };

    if (loading) return <div className="page-container">Loading cars...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Cars</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    Add New Car
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="form-card">
                    <h2>{editingCar ? "Edit Car" : "Add New Car"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="brand">Brand</label>
                                <input
                                    id="brand"
                                    name="brand"
                                    type="text"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="model">Model</label>
                                <input
                                    id="model"
                                    name="model"
                                    type="text"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="year">Year</label>
                                <input
                                    id="year"
                                    name="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="plate">Plate</label>
                                <input
                                    id="plate"
                                    name="plate"
                                    type="text"
                                    value={formData.plate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="color">Color</label>
                                <input
                                    id="color"
                                    name="color"
                                    type="text"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="commercialValue">Commercial Value</label>
                                <input
                                    id="commercialValue"
                                    name="commercialValue"
                                    type="number"
                                    step="0.01"
                                    value={formData.commercialValue}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="basePricePerHour">Price Per Hour</label>
                                <input
                                    id="basePricePerHour"
                                    name="basePricePerHour"
                                    type="number"
                                    step="0.01"
                                    value={formData.basePricePerHour}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mainPhoto">Main Photo</label>
                                <input
                                    id="mainPhoto"
                                    name="mainPhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="soatExpirationDate">SOAT Expiration</label>
                                <input
                                    id="soatExpirationDate"
                                    name="soatExpirationDate"
                                    type="date"
                                    value={formData.soatExpirationDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="techExpirationDate">Tech Expiration</label>
                                <input
                                    id="techExpirationDate"
                                    name="techExpirationDate"
                                    type="date"
                                    value={formData.techExpirationDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingCar ? "Update Car" : "Create Car"}
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Plate</th>
                            <th>Price/Hour</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car.id}>
                                <td>{car.id}</td>
                                <td>{car.brand}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.plate}</td>
                                <td>${car.basePricePerHour}</td>
                                <td>
                                    <button onClick={() => handleEdit(car)} className="btn-secondary btn-sm">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(car.id)} className="btn-danger btn-sm">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
