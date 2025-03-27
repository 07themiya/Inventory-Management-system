import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><Link href="/">Dashboard</Link></li>
        <li className={styles.navItem}><Link href="/inventory">Inventory</Link></li>
        <li className={styles.navItem}><Link href="/purchase">Purchase Log</Link></li>
        <li className={styles.navItem}><Link href="/usage">Usage Log</Link></li>
      </ul>
    </nav>
  );
}
