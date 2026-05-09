import styles from "./ParseResultDisplay.module.css";
import { ParseResult, ParseNotification } from "../../domain/parse-result";

interface ParseResultDisplayProps {
  result: ParseResult;
}

const NOTIFICATION_LABELS: Record<ParseNotification["type"], string> = {
  replaced: "Replaced",
  "missing-variable": "Missing variable",
  "null-value": "Null value",
  "unused-variable": "Unused variable",
};

const NOTIFICATION_STYLES: Record<ParseNotification["type"], string> = {
  replaced: styles.success,
  "missing-variable": styles.warning,
  "null-value": styles.warning,
  "unused-variable": styles.info,
};

function ParseResultDisplay(props: ParseResultDisplayProps) {
  return (
    <div className={styles.container}>
      <pre className={styles.text}>{props.result.text}</pre>
      {props.result.notifications.length > 0 && (
        <ul className={styles.notifications}>
          {props.result.notifications.map((notification, index) => (
            <li key={index} className={NOTIFICATION_STYLES[notification.type]}>
              {NOTIFICATION_LABELS[notification.type]}: {notification.key}
              {notification.type === "replaced" &&
                ` → ${notification.value} (${notification.occurrences})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { ParseResultDisplay };
