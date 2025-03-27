import { useState } from 'react';
import PurchaseForm from '../components/PurchaseForm';
import { useSelector } from 'react-redux';
import styles from './purchase.module.css';

export default function PurchaseLog() {
  const purchases = useSelector(state => state.inventory.purchases);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase => 
    purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.date.includes(searchTerm)
  );

  // Sort purchases
  const requestSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <span className={styles.statItem}>
            Total Purchases: <strong>{purchases.length}</strong>
          </span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {sortedPurchases.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th 
                    onClick={() => requestSort('date')} 
                    className={styles.sortableHeader}
                  >
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => requestSort('itemName')} 
                    className={styles.sortableHeader}
                  >
                    Item {sortConfig.key === 'itemName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => requestSort('category')} 
                    className={styles.sortableHeader}
                  >
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => requestSort('quantity')} 
                    className={styles.sortableHeader}
                  >
                    Qty {sortConfig.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => requestSort('unitPrice')} 
                    className={styles.sortableHeader}
                  >
                    Unit Price {sortConfig.key === 'unitPrice' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => requestSort('totalCost')} 
                    className={styles.sortableHeader}
                  >
                    Total {sortConfig.key === 'totalCost' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPurchases.map(purchase => (
                  <tr key={purchase.id} className={styles.tableRow}>
                    <td className={styles.dateCell}>{formatDate(purchase.date)}</td>
                    <td className={styles.itemCell}>{purchase.itemName}</td>
                    <td>
                      <span className={styles.categoryBadge}>{purchase.category}</span>
                    </td>
                    <td className={styles.quantityCell}>{purchase.quantity}</td>
                    <td className={styles.priceCell}>
                      {purchase.unitPrice ? `$${parseFloat(purchase.unitPrice).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className={styles.priceCell}>
                      {purchase.totalCost ? `$${parseFloat(purchase.totalCost).toFixed(2)}` : 'N/A'}
                    </td>
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
            <div className={styles.emptyIllustration}>📦</div>
            <h3 className={styles.emptyTitle}>
              {searchTerm ? 'No matching purchases found' : 'No purchase records yet'}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm ? 'Try a different search term' : 'Add your first purchase using the form above'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}