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

export const CompanyRentalsPage = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRentals();
    }, []);

    const loadRentals = async () => {
        try {
            const data = await RentalsService.getCompanyRentals();
            setRentals(data);
        } catch (err: any) {
            setError("Failed to load rentals");
        } finally {
            setLoading(false);
        }
    };

    const handleDeliver = async (rentalId: number) => {
        try {
            await RentalsService.deliver(rentalId);
            loadRentals();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to deliver rental");
        }
    };

    const handleComplete = async (rentalId: number) => {
        try {
            await RentalsService.complete(rentalId);
            loadRentals();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to complete rental");
        }
    };

    if (loading) return <div className="page-container">Loading rentals...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Company Rentals</h1>
            </div>

            {rentals.length === 0 ? (
                <p>No rentals found for your company.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Car</th>
                                <th>Client</th>
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
                                    <td>Client #{rental.clientId}</td>
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
                                                onClick={() => handleDeliver(rental.id)}
                                                className="btn-primary btn-sm"
                                            >
                                                Deliver
                                            </button>
                                        )}
                                        {rental.status === RentalStatus.InProgress && (
                                            <button
                                                onClick={() => handleComplete(rental.id)}
                                                className="btn-success btn-sm"
                                            >
                                                Complete
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
