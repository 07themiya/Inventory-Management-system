import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPurchase } from '../redux/actions';
import { format } from 'date-fns';

export default function PurchaseForm() {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    itemName: '',
    category: '',
    quantity: ''
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
      dispatch(updateItem(selectedItem.id, {
        purchased: selectedItem.purchased + parseInt(formData.quantity)
      }));
    }

    dispatch(addPurchase({
      ...formData,
      id: Date.now(),
      quantity: parseInt(formData.quantity)
    }));

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      itemName: '',
      category: '',
      quantity: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Purchase</h2>
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
          <label className="block mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
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
        Add Purchase
      </button>
    </form>
  );
}