import { useSelector } from 'react-redux';
import StatsCard from '../components/StatsCard';
import Link from 'next/link';

export default function Dashboard() {
  const items = useSelector(state => state.inventory.items);

  const totalItems = items.length;
  const totalStock = items.reduce((sum, item) => sum + item.initialStock + item.purchased - item.used, 0);
  const lowStockItems = items.filter(item => (item.initialStock + item.purchased - item.used) < 10).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Items" value={totalItems} color="blue" />
        <StatsCard title="Total Stock" value={totalStock} color="green" />
        <StatsCard title="Low Stock Items" value={lowStockItems} color={lowStockItems > 0 ? 'red' : 'green'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/inventory">
              <a className="block bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700">
                View Inventory
              </a>
            </Link>
            <Link href="/purchases">
              <a className="block bg-green-600 text-white px-4 py-2 rounded text-center hover:bg-green-700">
                Add Purchase
              </a>
            </Link>
            <Link href="/usage">
              <a className="block bg-purple-600 text-white px-4 py-2 rounded text-center hover:bg-purple-700">
                Log Usage
              </a>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Low Stock Alerts</h2>
          {lowStockItems > 0 ? (
            <ul className="space-y-2">
              {items
                .filter(item => (item.initialStock + item.purchased - item.used) < 10)
                .map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.initialStock + item.purchased - item.used} left</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-green-600">No low stock items!</p>
          )}
        </div>
      </div>
    </div>
  );
}