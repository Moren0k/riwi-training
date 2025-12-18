import { useState, useEffect } from "react";
import { RentalsService } from "../../services/rentals.service";
import type { Rental } from "../../types/models.types";
import { RentalStatus } from "../../types/models.types";

const getStatusLabel = (status: RentalStatus): string => {
    switch (status) {
        case RentalStatus.PendingDelivery: return "Pending Delivery";
        case RentalStatus.InProgress: return "In Progress";
        case RentalStatus.FinishedCorrect: return "Completed";
        case RentalStatus.FinishedWithIssue: return "Completed with Issue";
        case RentalStatus.Cancelled: return "Cancelled";
        case RentalStatus.Rejected: return "Rejected";
        default: return "Unknown";
    }
};

export const MyRentalsPage = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            const data = await RentalsService.getMyRentals();
            setRentals(data);
        } catch (err: any) {
            setError("Failed to load rentals");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (rentalId: number) => {
        if (!confirm("Are you sure you want to cancel this rental?")) return;

        try {
            await RentalsService.cancel(rentalId, "Client requested cancellation");
            loadRentals(); // Reload
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to cancel rental");
        }
    };

    if (loading) return <div className="page-container">Loading rentals...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Rentals</h1>
            </div>

            {rentals.length === 0 ? (
                <p>You have no rentals yet. <a href="/">Browse cars</a> to get started.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Car</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map((rental) => (
                                <tr key={rental.id}>
                                    <td>{rental.id}</td>
                                    <td>{rental.car ? `${rental.car.brand} ${rental.car.model}` : `Car #${rental.carId}`}</td>
                                    <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(rental.estimatedEndDate).toLocaleDateString()}</td>
                                    <td>${rental.totalPrice}</td>
                                    <td>
                                        <span className={`status-badge status-${rental.status}`}>
                                            {getStatusLabel(rental.status)}
                                        </span>
                                    </td>
                                    <td>
                                        {rental.status === RentalStatus.PendingDelivery && (
                                            <button
                                                onClick={() => handleCancel(rental.id)}
                                                className="btn-danger btn-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
