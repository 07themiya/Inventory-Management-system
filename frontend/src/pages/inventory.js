import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchItems, 
  addItem, 
  updateItem, 
  deleteItem 
} from '../redux/actions';
import styles from './inventory.module.css';

export default function InventoryLog() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => ({
    items: state.inventory.items || [],
    loading: state.inventory.loading,
    error: state.inventory.error
  }));

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    initialStock: '',
    purchased: '',
    used: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch items on component mount
  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await dispatch(updateItem(formData.id, formData));
      } else {
        await dispatch(addItem(formData));
      }
      
      resetForm();
      dispatch(fetchItems()); // Refresh the list
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  // Edit an existing item
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      initialStock: item.initialStock,
      purchased: item.purchased,
      used: item.used
    });
    setIsEditing(true);
  };

  // Delete an item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await dispatch(deleteItem(id));
        dispatch(fetchItems()); // Refresh the list
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      category: '',
      initialStock: '',
      purchased: '',
      used: ''
    });
    setIsEditing(false);
  };

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate current stock
  const calculateCurrentStock = (item) => {
    return (
      (Number(item.initialStock) || 0) + 
      (Number(item.purchased) || 0) - 
      (Number(item.used) || 0)
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Inventory Management</h1>
        <p>Add, edit, and manage your inventory items</p>
      </header>

      {/* Inventory Form */}
      <div className={styles.formSection}>
        <h2>{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Item Name*
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label>
                Category*
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Initial Stock
                <input
                  type="number"
                  name="initialStock"
                  value={formData.initialStock}
                  onChange={handleChange}
                  min="0"
                />
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label>
                Purchased
                <input
                  type="number"
                  name="purchased"
                  value={formData.purchased}
                  onChange={handleChange}
                  min="0"
                />
              </label>
            </div>
            
            <div className={styles.formGroup}>
              <label>
                Used
                <input
                  type="number"
                  name="used"
                  value={formData.used}
                  onChange={handleChange}
                  min="0"
                />
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? 'Update Item' : 'Add Item'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Inventory List */}
      <div className={styles.listSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span>🔍</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading inventory...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error.message}</div>
        ) : filteredItems.length > 0 ? (
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Initial Stock</th>
                <th>Purchased</th>
                <th>Used</th>
                <th>Current Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.initialStock}</td>
                  <td>{item.purchased}</td>
                  <td>{item.used}</td>
                  <td className={calculateCurrentStock(item) <= 0 ? styles.lowStock : ''}>
                    {calculateCurrentStock(item)}
                  </td>
                  <td className={styles.actions}>
                    <button 
                      onClick={() => handleEdit(item)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            {searchTerm ? 'No matching items found' : 'No inventory items yet'}
          </div>
        )}
      </div>
    </div>
  );
}