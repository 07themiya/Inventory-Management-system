import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/actions';
import InventoryTable from '../components/InventoryTable';
import styles from './inventory.module.css';

export default function InventoryList() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    initialStock: '',
    purchased: 0,
    used: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: Date.now(),
      initialStock: parseInt(formData.initialStock),
      purchased: parseInt(formData.purchased),
      used: parseInt(formData.used),
    };
    dispatch(addItem(newItem));
    setFormData({
      name: '',
      category: '',
      initialStock: '',
      purchased: 0,
      used: 0,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Inventory Management</h1>
        <p className={styles.subtitle}>Add and manage your inventory items</p>
      </header>

      <section className={styles.formSection}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Item</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Item Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter item name"
                  required
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Category
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter category"
                  required
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Initial Stock
                <input
                  type="number"
                  name="initialStock"
                  value={formData.initialStock}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter initial quantity"
                  min="0"
                  required
                />
              </label>
            </div>

            <button type="submit" className={styles.submitButton}>
              <span className={styles.buttonText}>Add Item</span>
              <span className={styles.buttonIcon}>+</span>
            </button>
          </form>
        </div>
      </section>

      <section className={styles.tableSection}>
        <InventoryTable />
      </section>
    </div>
  );
}