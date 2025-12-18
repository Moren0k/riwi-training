export const AdminDashboard = () => {
    return (
        <div className="page-container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Platform Administration</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Quick Actions</h3>
                    <ul className="action-list">
                        <li><a href="/admin/clients">Verify Clients</a></li>
                        <li><a href="/admin/companies">Manage Companies</a></li>
                        <li><a href="/admin/wallet">View Wallet</a></li>
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h3>System Status</h3>
                    <p>All systems operational.</p>
                </div>
            </div>
        </div>
    );
};
