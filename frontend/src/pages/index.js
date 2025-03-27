import { useSelector } from 'react-redux';
import StatsCard from '../components/StatsCard';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const items = useSelector(state => state.inventory.items);

  const totalItems = items.length;
  const totalStock = items.reduce((sum, item) => sum + item.initialStock + item.purchased - item.used, 0);
  const lowStockItems = items.filter(item => (item.initialStock + item.purchased - item.used) < 10);
  const criticalStockItems = items.filter(item => (item.initialStock + item.purchased - item.used) < 5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory Dashboard</h1>
        <p className={styles.subtitle}>Overview of your inventory status</p>
      </div>

      <div className={styles.statsGrid}>
        <StatsCard 
          title="Total Items" 
          value={totalItems} 
          icon="📦"
          trend="up"
          trendValue="12%"
          color="blue"
        />
        <StatsCard 
          title="Total Stock" 
          value={totalStock} 
          icon="📊"
          trend="neutral"
          color="green"
        />
        <StatsCard 
          title="Low Stock" 
          value={lowStockItems.length} 
          icon="⚠️"
          trend={criticalStockItems.length > 0 ? "critical" : "down"}
          trendValue={criticalStockItems.length > 0 ? `${criticalStockItems.length} critical` : "All good"}
          color={criticalStockItems.length > 0 ? "red" : "orange"}
        />
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <span className={styles.cardIcon}>⚡</span>
          </div>
          <div className={styles.actionsGrid}>
            <Link href="/inventory" className={`${styles.actionButton} ${styles.blue}`}>
              <span className={styles.actionIcon}>📋</span>
              View Inventory
            </Link>
            <Link href="/purchase" className={`${styles.actionButton} ${styles.green}`}>
              <span className={styles.actionIcon}>🛒</span>
              Add Purchase
            </Link>
            <Link href="/usage" className={`${styles.actionButton} ${styles.purple}`}>
              <span className={styles.actionIcon}>📝</span>
              Log Usage
            </Link>
            <Link href="/reports" className={`${styles.actionButton} ${styles.orange}`}>
              <span className={styles.actionIcon}>📊</span>
              Generate Report
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Stock Alerts</h2>
            <span className={styles.cardIcon}>🚨</span>
          </div>
          {lowStockItems.length > 0 ? (
            <div className={styles.alertContainer}>
              {criticalStockItems.length > 0 && (
                <>
                  <h3 className={styles.alertSubtitle}>Critical Stock</h3>
                  <ul className={styles.alertList}>
                    {criticalStockItems.map(item => (
                      <li key={item.id} className={`${styles.alertItem} ${styles.critical}`}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemStock}>
                          {item.initialStock + item.purchased - item.used} left
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <h3 className={styles.alertSubtitle}>Low Stock</h3>
              <ul className={styles.alertList}>
                {lowStockItems
                  .filter(item => (item.initialStock + item.purchased - item.used) >= 5)
                  .map(item => (
                    <li key={item.id} className={styles.alertItem}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemStock}>
                        {item.initialStock + item.purchased - item.used} left
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🎉</span>
              <h3 className={styles.emptyTitle}>All items in good stock!</h3>
              <p className={styles.emptyMessage}>No low stock items to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}