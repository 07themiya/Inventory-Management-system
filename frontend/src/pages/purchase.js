import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPurchaseLogs } from '../redux/actions';
import PurchaseForm from '../components/PurchaseForm';
import { createSelector } from 'reselect';
import styles from './purchase.module.css';

export default function PurchaseLog() {
  const dispatch = useDispatch();
  const purchases = useSelector(state => state.purchaseLogs?.purchaseLogs || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });

  const selectPurchaseLogs = state => state.purchaseLogs.purchaseLogs;

  const selectPurchaseLogsMemoized = createSelector(
    [selectPurchaseLogs],
    purchaseLogs => purchaseLogs
  );

  // Load purchases on mount
  useEffect(() => {
    dispatch(fetchPurchaseLogs());
  }, [dispatch]);

  // Debugging
  useEffect(() => {
    console.log('Purchases updated:', purchases);
  }, [purchases]);

  const filteredPurchases = purchases.filter(purchase => 
    purchase?.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase?.date?.includes(searchTerm)
  );

  const requestSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Purchase History</h1>
        <p className={styles.subtitle}>Track all inventory purchases</p>
      </header>

      <PurchaseForm />

      <br />
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search purchases..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        <div className={styles.stats}>
          <span>Total Purchases: <strong>{purchases.length}</strong></span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {sortedPurchases.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => requestSort('date')}>
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('itemName')}>
                    Item {sortConfig.key === 'itemName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('category')}>
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('quantity')}>
                    Qty {sortConfig.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{formatDate(purchase.date)}</td>
                    <td>{purchase.itemName || 'N/A'}</td>
                    <td>
                      <span className={styles.categoryBadge}>
                        {purchase.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td>{purchase.quantity || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.tableFooter}>
              Showing {sortedPurchases.length} of {purchases.length} records
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div>📦</div>
            <h3>
              {searchTerm ? 'No matching purchases found' : 'No purchase records yet'}
            </h3>
            <p>
              {searchTerm ? 'Try a different search term' : 'Add your first purchase above'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}