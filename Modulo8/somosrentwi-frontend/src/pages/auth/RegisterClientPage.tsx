import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { DocumentType } from "../../types/models.types";

export const RegisterClientPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        documentType: DocumentType.CC,
        documentNumber: "",
        birthDate: "",
        primaryPhone: "",
        address: "",
    });

    const [files, setFiles] = useState({
        selfiePhoto: null as File | null,
        documentFront: null as File | null,
        documentBack: null as File | null,
        licenseFront: null as File | null,
        licenseBack: null as File | null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: fileList } = e.target;
        if (fileList && fileList[0]) {
            setFiles({ ...files, [name]: fileList[0] });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append text fields
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value.toString());
            });

            // Append files
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formDataToSend.append(key, file);
                }
            });

            const response = await AuthService.registerClient(formDataToSend);
            login(response.token);
            navigate("/client/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-card wide">
                <h1>Client Registration</h1>
                <p className="form-subtitle">All fields are required</p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

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
                        <h3>Personal Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="documentType">Document Type</label>
                                <select
                                    id="documentType"
                                    name="documentType"
                                    value={formData.documentType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value={DocumentType.CC}>CC</option>
                                    <option value={DocumentType.CE}>CE</option>
                                    <option value={DocumentType.Passport}>Passport</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="documentNumber">Document Number</label>
                                <input
                                    id="documentNumber"
                                    name="documentNumber"
                                    type="text"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="birthDate">Birth Date</label>
                                <input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="primaryPhone">Primary Phone</label>
                                <input
                                    id="primaryPhone"
                                    name="primaryPhone"
                                    type="tel"
                                    value={formData.primaryPhone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

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
                    </div>

                    <div className="form-section">
                        <h3>Required Documents</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="selfiePhoto">Selfie Photo</label>
                                <input
                                    id="selfiePhoto"
                                    name="selfiePhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="documentFront">Document Front</label>
                                <input
                                    id="documentFront"
                                    name="documentFront"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="documentBack">Document Back</label>
                                <input
                                    id="documentBack"
                                    name="documentBack"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="licenseFront">License Front</label>
                                <input
                                    id="licenseFront"
                                    name="licenseFront"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="licenseBack">License Back</label>
                            <input
                                id="licenseBack"
                                name="licenseBack"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="form-footer">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};
