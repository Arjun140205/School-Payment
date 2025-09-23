import TransactionStatusCheck from '../components/TransactionStatusCheck';

export function TransactionStatus() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Transaction Status</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <TransactionStatusCheck />
      </div>
    </div>
  );
}