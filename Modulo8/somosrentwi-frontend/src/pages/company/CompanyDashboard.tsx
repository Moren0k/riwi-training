export const CompanyDashboard = () => {
    return (
        <div className="page-container">
            <div className="dashboard-header">
                <h1>Company Dashboard</h1>
                <p>Manage your fleet and rentals</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Quick Actions</h3>
                    <ul className="action-list">
                        <li><a href="/company/cars">Manage Cars</a></li>
                        <li><a href="/company/rentals">View Rentals</a></li>
                        <li><a href="/company/wallet">Check Wallet</a></li>
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h3>Company Info</h3>
                    <p>Your company account is active.</p>
                </div>
            </div>
        </div>
    );
};
