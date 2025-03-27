import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPurchase, updateItem } from '../redux/actions';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const selectedItem = items.find(item => item.name === formData.itemName);

      if (selectedItem) {
        dispatch(updateItem(selectedItem.id, {
          purchased: selectedItem.purchased + parseInt(formData.quantity)
        }));
      }

      const totalCost = parseFloat(formData.quantity) * parseFloat(formData.unitPrice || 0);

      dispatch(addPurchase({
        ...formData,
        id: Date.now(),
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice || 0),
        totalCost,
        date: new Date(formData.date).toISOString()
      }));

      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        itemName: '',
        category: '',
        quantity: '',
        unitPrice: '',
        supplier: ''
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

          {/* Unit Price Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Unit Price</label>
            <div className={styles.inputWithAddon}>
              <span className={styles.addon}>$</span>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className={styles.input}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            {errors.unitPrice && <span className={styles.error}>{errors.unitPrice}</span>}
          </div>

          {/* Supplier Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={styles.input}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.totalContainer}>
            <div className={styles.totalLabel}>Estimated Total</div>
            <div className={styles.totalAmount}>${calculateTotal()}</div>
          </div>
          
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
      </form>
    </div>
  );
}