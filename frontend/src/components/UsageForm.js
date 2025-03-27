import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUsage, updateItem } from "../redux/actions";
import { format } from "date-fns";
import styles from "./UsageForm.module.css";

export default function UsageForm() {
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    itemName: "",
    category: "",
    quantityUsed: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockInfo, setStockInfo] = useState(null);
  const items = useSelector((state) => state.inventory.items);
  const dispatch = useDispatch();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.itemName) newErrors.itemName = "Item name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.quantityUsed || formData.quantityUsed <= 0)
      newErrors.quantityUsed = "Enter a valid quantity";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });

    // Update stock info when item changes
    if (name === "itemName") {
      const selectedItem = items.find((item) => item.name === value);
      if (selectedItem) {
        const currentStock = selectedItem.initialStock + selectedItem.purchased - selectedItem.used;
        setStockInfo({
          current: currentStock,
          initial: selectedItem.initialStock,
          purchased: selectedItem.purchased,
          used: selectedItem.used
        });
      } else {
        setStockInfo(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const selectedItem = items.find((item) => item.name === formData.itemName);

    if (selectedItem) {
      const currentStock = selectedItem.initialStock + selectedItem.purchased - selectedItem.used;
      if (currentStock < parseInt(formData.quantityUsed)) {
        alert("Not enough stock available!");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Dispatch the addUsage action
      await dispatch(
        addUsage({
          ...formData,
          quantityUsed: parseInt(formData.quantityUsed),
        })
      );

      // Update inventory if item exists
      if (selectedItem) {
        await dispatch(
          updateItem(selectedItem.id, {
            used: selectedItem.used + parseInt(formData.quantityUsed),
          })
        );
      }

      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        itemName: "",
        category: "",
        quantityUsed: "",
      });
      setStockInfo(null);
    } catch (error) {
      console.error("Error logging usage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Log Weekly Usage</h2>
        <p className={styles.subtitle}>Track your inventory consumption</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Date Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Usage Date
              <span className={styles.required}>*</span>
            </label>
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
            <label className={styles.label}>
              Item Name
              <span className={styles.required}>*</span>
            </label>
            <select
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.itemName && (
              <span className={styles.error}>{errors.itemName}</span>
            )}
          </div>

          {/* Category Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Category
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.category && (
              <span className={styles.error}>{errors.category}</span>
            )}
          </div>

          {/* Quantity Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Quantity Used
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWithAddon}>
              <span className={styles.addon}>#</span>
              <input
                type="number"
                name="quantityUsed"
                value={formData.quantityUsed}
                onChange={handleChange}
                className={styles.input}
                min="1"
                required
              />
            </div>
            {errors.quantityUsed && (
              <span className={styles.error}>{errors.quantityUsed}</span>
            )}
          </div>
        </div>

        {/* Stock Information */}
        {stockInfo && (
          <div className={styles.stockInfo}>
            <div className={styles.stockInfoItem}>
              <span className={styles.stockLabel}>Current Stock:</span>
              <span className={styles.stockValue}>{stockInfo.current}</span>
            </div>
            <div className={styles.stockInfoItem}>
              <span className={styles.stockLabel}>Initial Stock:</span>
              <span className={styles.stockValue}>{stockInfo.initial}</span>
            </div>
            <div className={styles.stockInfoItem}>
              <span className={styles.stockLabel}>Purchased:</span>
              <span className={styles.stockValue}>{stockInfo.purchased}</span>
            </div>
            <div className={styles.stockInfoItem}>
              <span className={styles.stockLabel}>Used:</span>
              <span className={styles.stockValue}>{stockInfo.used}</span>
            </div>
          </div>
        )}

        <div className={styles.footer}>
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
              'Log Usage'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}