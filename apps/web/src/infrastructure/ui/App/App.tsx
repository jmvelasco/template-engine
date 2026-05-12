import styles from "./App.module.css";
import { useTemplateParser } from "./useTemplateParser";

export function App() {
  // Always consume hook using hook.property pattern (never destructure hook results)
  const parser = useTemplateParser();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span> Template Engine
        </h1>
        <p className={styles.subtitle}>
          Parse variables into template strings instantly using a high-fidelity,
          pure, and side-effect free compiler.
        </p>
      </header>

      <main className={styles.mainLayout}>
        {/* Left column: Inputs & Settings */}
        <section className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>⚙️ Editor Configuration</h2>

          <div className={styles.formGroup}>
            <label htmlFor="template-textarea" className={styles.label}>
              Template String
            </label>
            <textarea
              id="template-textarea"
              className={styles.textarea}
              placeholder="Enter your template here, e.g. Hello, ${name}!"
              value={parser.template}
              onChange={(e) => parser.setTemplate(e.target.value)}
              disabled={parser.isLoading}
            />
          </div>

          <div className={styles.variablesWrapper}>
            <div className={styles.logsHeader}>
              <label className={styles.label}>Variables Dictionary</label>
              <span className={styles.badge}>{parser.variableRows.length} rows</span>
            </div>

            {parser.variableRows.length > 0 && (
              <div className={styles.varHeaderRow}>
                <span className={styles.varHeaderLabel}>Variable Key</span>
                <span className={styles.varHeaderLabel}>Replacement Value</span>
                <span></span>
              </div>
            )}

            <div className={styles.variablesList}>
              {parser.variableRows.length === 0 ? (
                <p className={styles.emptyLogs}>
                  No variables defined. Click "Add Variable" to define some.
                </p>
              ) : (
                parser.variableRows.map((row) => (
                  <div key={row.id} className={styles.varRow}>
                    <input
                      type="text"
                      className={styles.inputMono}
                      placeholder="e.g. name"
                      value={row.key}
                      onChange={(e) =>
                        parser.updateVariableRow(row.id, { key: e.target.value })
                      }
                      disabled={parser.isLoading}
                    />
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Ada"
                      value={row.value}
                      onChange={(e) =>
                        parser.updateVariableRow(row.id, { value: e.target.value })
                      }
                      disabled={parser.isLoading}
                    />
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => parser.deleteVariableRow(row.id)}
                      disabled={parser.isLoading}
                      title="Delete variable"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.addButton}
              onClick={parser.addVariableRow}
              disabled={parser.isLoading}
            >
              ＋ Add Variable
            </button>
            <button
              type="button"
              className={styles.parseButton}
              onClick={parser.parseTemplate}
              disabled={parser.isLoading}
            >
              {parser.isLoading ? (
                <>
                  <div className={styles.spinner} /> Processing...
                </>
              ) : (
                <>⚡ Compile & Parse</>
              )}
            </button>
          </div>
        </section>

        {/* Right column: Output & Logs */}
        <section className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>🔮 Compile Output</h2>

          {parser.error && (
            <div className={styles.errorMessage}>
              <span>⚠️</span>
              <div>
                <strong>Error:</strong> {parser.error}
              </div>
            </div>
          )}

          <div className={styles.outputLabel}>
            Parsed Result
          </div>
          <div className={styles.outputArea}>
            {parser.parsedText ? (
              parser.parsedText
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
              {parser.events.length > 0 && (
                <span className={styles.badge}>{parser.events.length} logs</span>
              )}
            </div>

            <div className={styles.logTimeline}>
              {parser.events.length === 0 ? (
                <p className={styles.emptyLogs}>
                  No parse logs recorded yet. Compile a template to see notified
                  logs.
                </p>
              ) : (
                parser.events.map((event, index) => (
                  <div
                    key={index}
                    className={
                      event.type === "SUCCESS" ? styles.logSuccess : styles.logWarning
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
      </main>
    </div>
  );
}
