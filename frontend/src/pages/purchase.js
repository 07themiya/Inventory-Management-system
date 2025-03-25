import PurchaseForm from '../components/PurchaseForm';
import { useSelector } from 'react-redux';

export default function PurchaseLog() {
  const purchases = useSelector(state => state.inventory.purchases);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Purchase Log</h1>
      
      <PurchaseForm />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Past Purchases</h2>
        
        {purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Item Name</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td className="py-2 px-4 border">{purchase.date}</td>
                    <td className="py-2 px-4 border">{purchase.itemName}</td>
                    <td className="py-2 px-4 border">{purchase.category}</td>
                    <td className="py-2 px-4 border">{purchase.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No purchase records found.</p>
        )}
      </div>
    </div>
  );
}