import { useState, type FormEvent } from "react";
import { AdminService } from "../../services/admin.service";
import { CompanyPlan } from "../../types/models.types";

export const AdminCompaniesPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        tradeName: "",
        nitNumber: "",
        contactEmail: "",
        phones: "",
        address: "",
        companyPlan: CompanyPlan.Basic,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await AdminService.createCompany(formData);
            setSuccess("Company created successfully!");
            setShowForm(false);
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create company");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: "",
            password: "",
            tradeName: "",
            nitNumber: "",
            contactEmail: "",
            phones: "",
            address: "",
            companyPlan: CompanyPlan.Basic,
        });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Company Management</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? "Cancel" : "Create New Company"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {showForm && (
                <div className="form-card">
                    <h2>Create New Company</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h3>Account Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Company Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="tradeName">Trade Name</label>
                                    <input
                                        id="tradeName"
                                        name="tradeName"
                                        type="text"
                                        value={formData.tradeName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nitNumber">NIT Number</label>
                                    <input
                                        id="nitNumber"
                                        name="nitNumber"
                                        type="text"
                                        value={formData.nitNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contactEmail">Contact Email</label>
                                    <input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phones">Phones</label>
                                    <input
                                        id="phones"
                                        name="phones"
                                        type="text"
                                        value={formData.phones}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="companyPlan">Company Plan</label>
                                    <select
                                        id="companyPlan"
                                        name="companyPlan"
                                        value={formData.companyPlan}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value={CompanyPlan.Basic}>Basic</option>
                                        <option value={CompanyPlan.Pro}>Pro</option>
                                        <option value={CompanyPlan.Enterprise}>Enterprise</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? "Creating..." : "Create Company"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
