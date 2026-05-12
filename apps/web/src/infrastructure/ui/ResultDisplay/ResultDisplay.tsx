import type { ParseResponse } from "@template-engine/api-types";
import styles from "./ResultDisplay.module.css";

interface Props {
  result: ParseResponse;
}

const badgeStyles: Record<string, string> = {
  success: styles.badgeSuccess,
  partial: styles.badgePartial,
  warning: styles.badgeWarning,
};

export function ResultDisplay(props: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Result</label>
        <span className={badgeStyles[props.result.status]}>
          {props.result.status}
        </span>
      </div>
      <pre className={styles.output}>{props.result.text}</pre>
    </div>
  );
}
