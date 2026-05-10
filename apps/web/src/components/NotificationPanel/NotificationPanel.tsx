import type { ParsingNotification } from "../../types/api";
import styles from "./NotificationPanel.module.css";

export interface NotificationPanelProps {
  notifications: ParsingNotification[];
}

export function NotificationPanel(props: NotificationPanelProps) {
  const getLineClass = (type: string): string => {
    switch (type) {
      case "ERROR":
        return styles.lineError;
      case "INFO":
        return styles.lineInfo;
      case "WARNING":
      default:
        return styles.lineWarning;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.terminalHeader}>
        <div className={styles.dotsContainer}>
          <div className={`${styles.dot} ${styles.dotClose}`}></div>
          <div className={`${styles.dot} ${styles.dotMinimize}`}></div>
          <div className={`${styles.dot} ${styles.dotMaximize}`}></div>
        </div>
        <h4 className={styles.title}>System Log & Notifier Warnings</h4>
      </div>
      <div className={styles.terminalBody}>
        {props.notifications.length === 0 ? (
          <div className={styles.idleMessage}>
            <span>$ parser-engine --status=idle</span>
            <span className={styles.idleCursor}></span>
          </div>
        ) : (
          props.notifications.map((notif, index) => (
            <div
              key={`${notif.code}-${index}`}
              className={`${styles.line} ${getLineClass(notif.type)}`}
            >
              <span className={styles.severity}>{notif.type}</span>
              <span className={styles.code}>({notif.code}):</span>
              <span className={styles.message}>{notif.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
