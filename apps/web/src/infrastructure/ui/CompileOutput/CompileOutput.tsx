import styles from "./CompileOutput.module.css";
import { TemplateParserHook } from "../App/useTemplateParser";

interface Props {
  parser: TemplateParserHook;
}

export function CompileOutput(props: Props) {
  return (
    <section className={styles.glassCard}>
      <h2 className={styles.sectionTitle}>🔮 Compile Output</h2>

      {props.parser.error && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <div>
            <strong>Error:</strong> {props.parser.error}
          </div>
        </div>
      )}

      <div className={styles.outputLabel}>Parsed Result</div>
      <div className={styles.outputArea}>
        {props.parser.parsedText ? (
          props.parser.parsedText
        ) : (
          <span className={styles.placeholderOutput}>
            Your parsed template output will appear here after clicking
            "Compile & Parse"...
          </span>
        )}
      </div>

      <div className={styles.logsSection}>
        <div className={styles.logsHeader}>
          <div className={styles.label}>Execution Event Logs</div>
          {props.parser.events.length > 0 && (
            <span className={styles.badge}>
              {props.parser.events.length} logs
            </span>
          )}
        </div>

        <div className={styles.logTimeline}>
          {props.parser.events.length === 0 ? (
            <p className={styles.emptyLogs}>
              No parse logs recorded yet. Compile a template to see notified
              logs.
            </p>
          ) : (
            props.parser.events.map((event, index) => (
              <div
                key={index}
                className={
                  event.type === "SUCCESS"
                    ? styles.logSuccess
                    : styles.logWarning
                }
              >
                <span className={styles.logIcon}>
                  {event.type === "SUCCESS" ? "✓" : "⚠"}
                </span>
                <span className={styles.logMessage}>{event.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
