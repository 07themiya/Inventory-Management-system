import { useState } from 'react';
import UsageForm from '../components/UsageForm';
import { useSelector } from 'react-redux';

export default function UsageLog() {
  const usage = useSelector(state => state.inventory.usage);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'descending'
  });

  // Filter usage entries
  const filteredUsage = usage.filter(entry => 
    entry.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date.includes(searchTerm)
  );

  // Sort usage entries
  const sortedUsage = [...filteredUsage].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting when column header is clicked
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usage Log</h1>
      
      <UsageForm />

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search by item, category, or date..."
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Past Usage</h2>
        
        {sortedUsage.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th 
                    className="py-3 px-4 border font-semibold text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('date')}
                  >
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="py-3 px-4 border font-semibold text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('itemName')}
                  >
                    Item Name {sortConfig.key === 'itemName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="py-3 px-4 border font-semibold text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('category')}
                  >
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="py-3 px-4 border font-semibold text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('quantityUsed')}
                  >
                    Quantity Used {sortConfig.key === 'quantityUsed' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsage.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50">
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
          <p className="text-gray-500">
            {searchTerm ? 'No matching usage records found.' : 'No usage records found.'}
          </p>
        )}
      </div>
    </div>
  );
}