import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPurchaseLog, fetchPurchaseLogs } from '../redux/actions';
import { format } from 'date-fns';
import styles from './PurchaseForm.module.css';

export default function PurchaseForm() {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    itemName: '',
    category: '',
    quantity: '',
    unitPrice: '',
    supplier: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const items = useSelector(state => state.inventory.items);
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName) newErrors.itemName = 'Item name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Enter valid quantity';
    if (formData.unitPrice && formData.unitPrice < 0) newErrors.unitPrice = 'Price must be positive';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

// In PurchaseForm.js
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    // First add the purchase
    await dispatch(addPurchaseLog({
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      totalCost: Number(formData.quantity) * Number(formData.unitPrice)
    }));

    // Then refresh the purchase list
    await dispatch(fetchPurchaseLogs());

    // Reset form
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      itemName: '',
      category: '',
      quantity: '',
      unitPrice: ''
    });
  } catch (error) {
    console.error('Error submitting purchase:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  const calculateTotal = () => {
    if (formData.quantity && formData.unitPrice) {
      return (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>New Purchase Order</h2>
        <p className={styles.subtitle}>Record inventory purchases</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Date Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Purchase Date</label>
            <div className={styles.inputWithAddon}>
              <span className={styles.addon}>📅</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Item Name Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Item Name</label>
            <select
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Select an item</option>
              {items.map(item => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
            {errors.itemName && <span className={styles.error}>{errors.itemName}</span>}
          </div>

          {/* Category Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.category && <span className={styles.error}>{errors.category}</span>}
          </div>

          {/* Quantity Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Quantity</label>
            <div className={styles.inputWithAddon}>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={styles.input}
                min="1"
                required
              />
              <span className={styles.rightAddon}>units</span>
            </div>
            {errors.quantity && <span className={styles.error}>{errors.quantity}</span>}
          </div>
          
          <div>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span> Processing...
              </>
            ) : (
              'Record Purchase'
            )}
          </button>
          </div>
        </div>
      </form>
    </div>
  );
}