import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../redux/inventorySlice";
import styles from "./InventoryList.module.css";

export default function InventoryList() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedInventory = [...filteredInventory].sort((a, b) => {
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
        <h2 className={styles.title}>Inventory Management</h2>
        <p className={styles.subtitle}>View and manage your inventory items</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search items..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total Items: <strong>{inventory.length}</strong>
          </span>
          <span className={styles.statItem}>
            In Stock: <strong>{inventory.filter(i => i.currentStock > 0).length}</strong>
          </span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('name')} 
                className={styles.sortableHeader}
              >
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => requestSort('category')} 
                className={styles.sortableHeader}
              >
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => requestSort('currentStock')} 
                className={styles.sortableHeader}
              >
                Stock {sortConfig.key === 'currentStock' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td className={styles.itemName}>{item.name}</td>
                <td>
                  <span className={styles.categoryBadge}>{item.category}</span>
                </td>
                <td className={item.currentStock < 10 ? styles.lowStock : styles.normalStock}>
                  {item.currentStock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedInventory.length === 0 && (
          <div className={styles.emptyState}>
            {searchTerm ? 'No matching items found' : 'No inventory items available'}
          </div>
        )}
      </div>
    </div>
  );
}