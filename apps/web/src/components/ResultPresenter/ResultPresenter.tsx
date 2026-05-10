import { Maybe } from "../../utils/Maybe";
import type { ParsingResult } from "../../types/api";
import styles from "./ResultPresenter.module.css";

export interface ResultPresenterProps {
  result: Maybe<ParsingResult>;
  error: Maybe<string>;
}

export function ResultPresenter(props: ResultPresenterProps) {
  const getBadgeClass = (status: string): string => {
    switch (status) {
      case "SUCCESS":
        return styles.badgeSuccess;
      case "PARTIAL":
        return styles.badgePartial;
      case "FAILED":
      default:
        return styles.badgeFailed;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Parsed Output</h3>
        {props.result.fold(
          () => null,
          (res) => (
            <span className={`${styles.badge} ${getBadgeClass(res.status)}`}>
              {res.status}
            </span>
          ),
        )}
      </div>
      {props.error.fold(
        () => null,
        (errorMessage) => (
          <div className={styles.errorAlert} role="alert">
            <svg
              className={styles.errorIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Parsing Error:</strong> {errorMessage}
            </div>
          </div>
        ),
      )}
      {props.result.fold(
        () => (
          <div className={styles.emptyState}>
            Your parsed output will appear here after clicking "Process
            Template".
          </div>
        ),
        (res) => (
          <pre
            className={styles.previewBox}
            aria-label="Parsed output text preview"
          >
            {res.renderedText}
          </pre>
        ),
      )}
    </div>
  );
}
