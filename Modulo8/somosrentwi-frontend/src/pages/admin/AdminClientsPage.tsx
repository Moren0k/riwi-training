import { useState, useEffect } from "react";
import { AdminService } from "../../services/admin.service";
import type { Client } from "../../types/models.types";
import { ClientVerificationStatus } from "../../types/models.types";

const getStatusLabel = (status: ClientVerificationStatus): string => {
    switch (status) {
        case ClientVerificationStatus.Pending: return "Pending";
        case ClientVerificationStatus.Accepted: return "Accepted";
        case ClientVerificationStatus.Rejected: return "Rejected";
        default: return "Unknown";
    }
};

export const AdminClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const data = await AdminService.getAllClients();
            setClients(data);
        } catch (err: any) {
            setError("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (clientId: number, status: ClientVerificationStatus) => {
        try {
            await AdminService.updateClientStatus(clientId, status);
            loadClients(); // Reload
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to update client status");
        }
    };

    if (loading) return <div className="page-container">Loading clients...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Client Verification</h1>
            </div>

            {clients.length === 0 ? (
                <p>No clients registered yet.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Document</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.id}</td>
                                    <td>{client.firstName} {client.lastName}</td>
                                    <td>{client.email}</td>
                                    <td>{client.documentNumber}</td>
                                    <td>{client.primaryPhone}</td>
                                    <td>
                                        <span className={`status-badge status-${client.verificationStatus}`}>
                                            {getStatusLabel(client.verificationStatus)}
                                        </span>
                                    </td>
                                    <td>
                                        {client.verificationStatus !== ClientVerificationStatus.Accepted && (
                                            <button
                                                onClick={() => handleUpdateStatus(client.id, ClientVerificationStatus.Accepted)}
                                                className="btn-success btn-sm"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {client.verificationStatus !== ClientVerificationStatus.Rejected && (
                                            <button
                                                onClick={() => handleUpdateStatus(client.id, ClientVerificationStatus.Rejected)}
                                                className="btn-danger btn-sm"
                                            >
                                                Reject
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
