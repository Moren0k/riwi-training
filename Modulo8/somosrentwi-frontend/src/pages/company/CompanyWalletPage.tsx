import { useState, useEffect } from "react";
import { WalletService } from "../../services/wallet.service";
import type { CompanyWallet } from "../../types/models.types";

export const CompanyWalletPage = () => {
    const [wallet, setWallet] = useState<CompanyWallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadWallet();
    }, []);

    const loadWallet = async () => {
        try {
            const data = await WalletService.getCompanyWallet();
            setWallet(data);
        } catch (err: any) {
            setError("Failed to load wallet");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-container">Loading wallet...</div>;
    if (error) return <div className="page-container error-message">{error}</div>;
    if (!wallet) return <div className="page-container">No wallet data available</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Company Wallet</h1>
            </div>

            <div className="wallet-card">
                <div className="wallet-balance">
                    <h2>Current Balance</h2>
                    <p className="balance-amount">${wallet.balance.toFixed(2)}</p>
                </div>
            </div>

            <div className="transactions-section">
                <h3>Transaction History</h3>
                {wallet.transactions && wallet.transactions.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallet.transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleString() : "N/A"}</td>
                                        <td>{transaction.description}</td>
                                        <td className="amount-positive">${transaction.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No transactions yet.</p>
                )}
            </div>
        </div>
    );
};
