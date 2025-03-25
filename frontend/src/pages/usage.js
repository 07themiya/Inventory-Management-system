import UsageForm from '../components/UsageForm';
import { useSelector } from 'react-redux';

export default function UsageLog() {
  const usage = useSelector(state => state.inventory.usage);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usage Log</h1>
      
      <UsageForm />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Past Usage</h2>
        
        {usage.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Item Name</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Quantity Used</th>
                </tr>
              </thead>
              <tbody>
                {usage.map(entry => (
                  <tr key={entry.id}>
                    <td className="py-2 px-4 border">{entry.date}</td>
                    <td className="py-2 px-4 border">{entry.itemName}</td>
                    <td className="py-2 px-4 border">{entry.category}</td>
                    <td className="py-2 px-4 border">{entry.quantityUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No usage records found.</p>
        )}
      </div>
    </div>
  );
}