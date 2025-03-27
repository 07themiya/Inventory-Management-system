import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, updateItem } from "../redux/actions";
import styles from "./InventoryTable.module.css";

export default function InventoryTable() {
  const items = useSelector((state) => state.inventory.items);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
      [e.target.name]: e.target.value,
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Inventory Overview</h2>
        <p className={styles.subtitle}>{items.length} items in stock</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} className={styles.sortableHeader}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('category')} className={styles.sortableHeader}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Initial Stock</th>
              <th>Purchased</th>
              <th>Used</th>
              <th>Current Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      className={styles.editInput}
                    />
                  ) : (
                    <span className={styles.itemName}>{item.name}</span>
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleChange}
                      className={styles.editInput}
                    />
                  ) : (
                    <span className={styles.categoryBadge}>{item.category}</span>
                  )}
                </td>
                <td className={styles.stockCell}>{item.initialStock}</td>
                <td className={styles.stockCell}>{item.purchased}</td>
                <td className={styles.stockCell}>{item.used}</td>
                <td className={styles.stockCell}>
                  <span className={item.initialStock + item.purchased - item.used < 10 ? styles.lowStock : styles.normalStock}>
                    {item.initialStock + item.purchased - item.used}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actionButtons}>
                    {editingId === item.id ? (
                      <button onClick={() => handleSave(item.id)} className={`${styles.button} ${styles.saveButton}`}>
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(item)} className={`${styles.button} ${styles.editButton}`}>
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => dispatch(deleteItem(item.id))} 
                      className={`${styles.button} ${styles.deleteButton}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}