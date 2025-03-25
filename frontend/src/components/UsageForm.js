import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUsage } from '../redux/actions';
import { format } from 'date-fns';

export default function UsageForm() {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    itemName: '',
    category: '',
    quantityUsed: ''
  });
  const items = useSelector(state => state.inventory.items);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedItem = items.find(item => item.name === formData.itemName);
    
    if (selectedItem) {
      const currentStock = selectedItem.initialStock + selectedItem.purchased - selectedItem.used;
      if (currentStock >= parseInt(formData.quantityUsed)) {
        dispatch(updateItem(selectedItem.id, {
          used: selectedItem.used + parseInt(formData.quantityUsed)
        }));
      } else {
        alert('Not enough stock available!');
        return;
      }
    }

    dispatch(addUsage({
      ...formData,
      id: Date.now(),
      quantityUsed: parseInt(formData.quantityUsed)
    }));

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      itemName: '',
      category: '',
      quantityUsed: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-xl font-bold mb-4">Log Weekly Usage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Item Name</label>
          <select
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Item</option>
            {items.map(item => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Category</label>
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
          <label className="block mb-2">Quantity Used</label>
          <input
            type="number"
            name="quantityUsed"
            value={formData.quantityUsed}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Log Usage
      </button>
    </form>
  );
}