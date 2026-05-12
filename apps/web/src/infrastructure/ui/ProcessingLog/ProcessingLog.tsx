import type { Notification } from "@template-engine/api-types";
import styles from "./ProcessingLog.module.css";

interface Props {
  notifications: Notification[];
}

const notificationStyles: Record<string, string> = {
  success: styles.notificationSuccess,
  warning: styles.notificationWarning,
  error: styles.notificationError,
  info: styles.notificationInfo,
};

const dotStyles: Record<string, string> = {
  success: styles.dotSuccess,
  warning: styles.dotWarning,
  error: styles.dotError,
  info: styles.dotInfo,
};

export function ProcessingLog(props: Props) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Processing Log</label>
      <ul className={styles.list}>
        {props.notifications.map((notification, index) => (
          <li
            className={notificationStyles[notification.type]}
            key={index}
          >
            <span className={dotStyles[notification.type]} />
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
