import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UsageForm from '../components/UsageForm';
import { fetchUsage, fetchItems } from '../redux/actions';
import styles from './usageLog.module.css';

export default function UsageLog() {
  const dispatch = useDispatch();
  
  // Fetch both usage and inventory data
  useEffect(() => {
    dispatch(fetchUsage());
    dispatch(fetchItems());
  }, [dispatch]);

  // Get data from Redux store
  const { records = [], loading: usageLoading, error: usageError } = useSelector(state => state.usage || {});
  const { items = [], loading: inventoryLoading, error: inventoryError } = useSelector(state => state.inventory || {});

  // State for search and sorting
  const [inventorySearch, setInventorySearch] = useState('');
  const [usageSearch, setUsageSearch] = useState('');
  const [inventorySortConfig, setInventorySortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [usageSortConfig, setUsageSortConfig] = useState({ key: 'date', direction: 'descending' });

  // Calculate current stock for inventory items
  const calculateCurrentStock = (item) => {
    return (Number(item.initialStock) || 0) + (Number(item.purchased) || 0) - (Number(item.used) || 0);
  };

  // Filter and sort inventory items
  const filteredInventory = items.filter(item => 
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(inventorySearch.toLowerCase()))
  );

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let valueA, valueB;
    
    if (inventorySortConfig.key === 'currentStock') {
      valueA = calculateCurrentStock(a);
      valueB = calculateCurrentStock(b);
    } else {
      valueA = a[inventorySortConfig.key];
      valueB = b[inventorySortConfig.key];
    }

    if (valueA < valueB) {
      return inventorySortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valueA > valueB) {
      return inventorySortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter and sort usage records
  const filteredUsage = records.filter(entry => 
    entry.itemName.toLowerCase().includes(usageSearch.toLowerCase()) ||
    (entry.category && entry.category.toLowerCase().includes(usageSearch.toLowerCase())) ||
    entry.date.includes(usageSearch)
  );

  const sortedUsage = [...filteredUsage].sort((a, b) => {
    if (a[usageSortConfig.key] < b[usageSortConfig.key]) {
      return usageSortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[usageSortConfig.key] > b[usageSortConfig.key]) {
      return usageSortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Sort request handlers
  const requestInventorySort = (key) => {
    let direction = 'ascending';
    if (inventorySortConfig.key === key && inventorySortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setInventorySortConfig({ key, direction });
  };

  const requestUsageSort = (key) => {
    let direction = 'ascending';
    if (usageSortConfig.key === key && usageSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setUsageSortConfig({ key, direction });
  };

  if (usageLoading || inventoryLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Usage Log</h1>
        <p className={styles.subtitle}>Track your inventory consumption history</p>
      </div>

      <div className={styles.card}>
        <UsageForm />
      </div>

      {/* Inventory Table */}
      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Inventory Overview</h2>
          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search inventory..."
                className={styles.searchBar}
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
              />
            </div><br />
            <div className={styles.filterButtons}>
              <button onClick={() => requestInventorySort('name')}>
                Sort by Name {inventorySortConfig.key === 'name' && (
                  inventorySortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </button>
              <button onClick={() => requestInventorySort('currentStock')}>
                Sort by Stock {inventorySortConfig.key === 'currentStock' && (
                  inventorySortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Initial Stock</th>
                <th>Purchased</th>
                <th>Used</th>
                <th>Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {sortedInventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.initialStock}</td>
                  <td>{item.purchased}</td>
                  <td>{item.used}</td>
                  <td className={calculateCurrentStock(item) <= 0 ? styles.lowStock : ''}>
                    {calculateCurrentStock(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}