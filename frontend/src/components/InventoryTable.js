import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, updateItem } from '../redux/actions';

export default function InventoryTable() {
  const items = useSelector(state => state.inventory.items);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = (id) => {
    dispatch(updateItem(id, editForm));
    setEditingId(null);
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Category</th>
            <th className="py-2 px-4 border">Initial Stock</th>
            <th className="py-2 px-4 border">Purchased</th>
            <th className="py-2 px-4 border">Used</th>
            <th className="py-2 px-4 border">Current Stock</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="py-2 px-4 border">
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    className="border p-1"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleChange}
                    className="border p-1"
                  />
                ) : (
                  item.category
                )}
              </td>
              <td className="py-2 px-4 border">{item.initialStock}</td>
              <td className="py-2 px-4 border">{item.purchased}</td>
              <td className="py-2 px-4 border">{item.used}</td>
              <td className="py-2 px-4 border">
                {item.initialStock + item.purchased - item.used}
              </td>
              <td className="py-2 px-4 border">
                {editingId === item.id ? (
                  <button
                    onClick={() => handleSave(item.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => dispatch(deleteItem(item.id))}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}