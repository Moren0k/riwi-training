import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth.types";
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import { MainLayout } from "../layouts/MainLayout";

// Public Pages
import { LandingPage } from "../pages/public/LandingPage";
import { CarsPage } from "../pages/public/CarsPage";
import { CarDetailsPage } from "../pages/public/CarDetailsPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterClientPage } from "../pages/auth/RegisterClientPage";

// Client Pages
import { ClientDashboard } from "../pages/client/ClientDashboard";
import { MyRentalsPage } from "../pages/client/MyRentalsPage";
import { CreateRentalPage } from "../pages/client/CreateRentalPage";

// Company Pages
import { CompanyDashboard } from "../pages/company/CompanyDashboard";
import { CompanyCarsPage } from "../pages/company/CompanyCarsPage";
import { CompanyRentalsPage } from "../pages/company/CompanyRentalsPage";
import { CompanyWalletPage } from "../pages/company/CompanyWalletPage";

// Admin Pages
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminClientsPage } from "../pages/admin/AdminClientsPage";
import { AdminCompaniesPage } from "../pages/admin/AdminCompaniesPage";
import { AdminWalletPage } from "../pages/admin/AdminWalletPage";

const UnauthorizedPage = () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>403 - Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
    </div>
);

const DashboardRedirect = () => {
    const { role } = useAuth();

    if (role === UserRole.Admin) return <Navigate to="/admin/dashboard" replace />;
    if (role === UserRole.Company) return <Navigate to="/company/dashboard" replace />;
    if (role === UserRole.Client) return <Navigate to="/client/dashboard" replace />;

    return <Navigate to="/" replace />;
};

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="cars" element={<CarsPage />} />
                    <Route path="cars/:id" element={<CarDetailsPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterClientPage />} />
                    <Route path="unauthorized" element={<UnauthorizedPage />} />

                    {/* Dashboard Redirect */}
                    <Route path="dashboard" element={<DashboardRedirect />} />

                    {/* Client Routes */}
                    <Route
                        path="client/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Client]}>
                                <ClientDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="client/rentals"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Client]}>
                                <MyRentalsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="client/rentals/new"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Client]}>
                                <CreateRentalPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Company Routes */}
                    <Route
                        path="company/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Company]}>
                                <CompanyDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="company/cars"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Company]}>
                                <CompanyCarsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="company/rentals"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Company]}>
                                <CompanyRentalsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="company/wallet"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Company]}>
                                <CompanyWalletPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/clients"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                                <AdminClientsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/companies"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                                <AdminCompaniesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/wallet"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                                <AdminWalletPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
