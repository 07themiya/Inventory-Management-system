import { useState } from 'react';
import UsageForm from '../components/UsageForm';
import { useSelector } from 'react-redux';
import styles from './UsageLog.module.css';

export default function UsageLog() {
  const usage = useSelector(state => state.inventory?.usage ?? []); // Ensure usage is always an array
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'descending'
  });

  // Ensure filtering only happens if usage is an array
  const filteredUsage = Array.isArray(usage) ? usage.filter(entry => 
    entry.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date.includes(searchTerm)
  ) : [];

  const sortedUsage = [...filteredUsage].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Usage Log</h1>
        <p className={styles.subtitle}>Track your inventory consumption history</p>
      </div>

      <div className={styles.card}>
        <UsageForm />
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by item, category, or date..."
            className={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div><br />
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${sortConfig.key === 'date' ? styles.active : ''}`}
            onClick={() => requestSort('date')}
          >
            <span className={styles.icon}>📅</span>
            Recent
          </button>
          
          <button 
            className={`${styles.filterButton} ${sortConfig.key === 'quantityUsed' ? styles.active : ''}`}
            onClick={() => requestSort('quantityUsed')}
          >
            <span className={styles.icon}>📊</span>
            Largest Usage
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Usage History</h2>
          <div className={styles.summary}>
            <span className={styles.summaryIcon}>📊</span>
            Showing {sortedUsage.length} of {usage.length} records
          </div>
        </div>

        {sortedUsage.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => requestSort('date')} className={`${styles.sortableHeader} ${sortConfig.key === 'date' ? styles.active : ''}`}>
                    <div className={styles.headerContent}>
                      Date
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('itemName')} className={`${styles.sortableHeader} ${sortConfig.key === 'itemName' ? styles.active : ''}`}>
                    <div className={styles.headerContent}>
                      Item
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'itemName' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('category')} className={`${styles.sortableHeader} ${sortConfig.key === 'category' ? styles.active : ''}`}>
                    <div className={styles.headerContent}>
                      Category
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </th>
                  <th onClick={() => requestSort('quantityUsed')} className={`${styles.sortableHeader} ${sortConfig.key === 'quantityUsed' ? styles.active : ''}`}>
                    <div className={styles.headerContent}>
                      Quantity Used
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'quantityUsed' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsage.map(entry => (
                  <tr key={entry.id} className={styles.tableRow}>
                    <td className={styles.dateCell}>
                      <div className={styles.dateContent}>
                        <span className={styles.dateDay}>
                          {new Date(entry.date).getDate()}
                        </span>
                        <span className={styles.dateMonth}>
                          {new Date(entry.date).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                    </td>
                    <td className={styles.itemCell}>{entry.itemName}</td>
                    <td className={styles.categoryCell}>
                      <span className={styles.categoryBadge}>{entry.category}</span>
                    </td>
                    <td className={styles.quantityCell}>
                      <div className={styles.quantityContainer}>
                        <span className={styles.quantityBadge}>{entry.quantityUsed}</span>
                        <span className={styles.quantityUnit}>units</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h3 className={styles.emptyTitle}>
              {searchTerm ? 'No matching records found' : 'No usage records yet'}
            </h3>
            <p className={styles.emptyMessage}>
              {searchTerm ? 'Try a different search term' : 'Start by logging your first usage'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
