import { useState, useEffect } from 'react';
import api from '../services/api';

// This is a temporary way to store the token for testing
const TEMP_AUTH_TOKEN = 'PASTE_YOUR_TOKEN_HERE';

function TransactionsOverview() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/payments/transactions', {
          headers: {
            Authorization: `Bearer ${TEMP_AUTH_TOKEN}`,
          },
        });
        setTransactions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transactions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // The empty array means this effect runs once when the component mounts

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transactions History</h2>

      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        // We'll replace this with a proper table soon
        <div className="bg-white p-4 rounded shadow">
          <pre>{JSON.stringify(transactions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TransactionsOverview;