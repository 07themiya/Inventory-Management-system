import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/actions';
import InventoryTable from '../components/InventoryTable';

export default function InventoryList() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    initialStock: '',
    purchased: 0,
    used: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: Date.now(),
      initialStock: parseInt(formData.initialStock),
      purchased: parseInt(formData.purchased),
      used: parseInt(formData.used)
    };
    dispatch(addItem(newItem));
    setFormData({
      name: '',
      category: '',
      initialStock: '',
      purchased: 0,
      used: 0
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory List</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Category</label>ai
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Initial Stock</label>
            <input
              type="number"
              name="initialStock"
              value={formData.initialStock}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded col-span-3 md:col-span-1"
          >
            Add Item
          </button>
        </form>
      </div>

      <InventoryTable />
    </div>
  );
}