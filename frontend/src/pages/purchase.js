import { useState } from 'react';
import PurchaseForm from '../components/PurchaseForm';
import { useSelector } from 'react-redux';

export default function PurchaseLog() {
  const purchases = useSelector(state => state.inventory.purchases);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase => 
    purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.date.includes(searchTerm)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Purchase Log</h1>
      
      <PurchaseForm />

      {/* Search Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search by item, category, or date..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Past Purchases</h2>
        
        {filteredPurchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 border font-semibold text-left">Date</th>
                  <th className="py-3 px-4 border font-semibold text-left">Item Name</th>
                  <th className="py-3 px-4 border font-semibold text-left">Category</th>
                  <th className="py-3 px-4 border font-semibold text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map(purchase => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
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
          <p className="text-gray-500">
            {searchTerm ? 'No matching purchases found.' : 'No purchase records found.'}
          </p>
        )}
      </div>
    </div>
  );
}