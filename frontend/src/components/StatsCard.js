import styles from "./StatsCard.module.css";

export default function StatsCard({ title, icon, value, cardColor = "default" }) {
  return (
    <div className={`${styles["stats-card"]} ${styles[`stats-card--${cardColor}`] || ""}`}>
      {icon && <span className={styles["stats-card-icon"]}>{icon}</span>}
      <div>
        <h3 className={styles["stats-card-title"]}>{title}</h3>
        <p className={styles["stats-card-value"]}>{value}</p>
      </div>
    </div>
  );
}
