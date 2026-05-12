import styles from "./EditorConfiguration.module.css";
import { TemplateParserHook } from "../App/useTemplateParser";

interface Props {
  parser: TemplateParserHook;
}

export function EditorConfiguration(props: Props) {
  return (
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
          value={props.parser.template}
          onChange={(e) => props.parser.setTemplate(e.target.value)}
          disabled={props.parser.isLoading}
        />
      </div>

      <div className={styles.variablesWrapper}>
        <div className={styles.logsHeader}>
          <label className={styles.label}>Variables Dictionary</label>
          <span className={styles.badge}>
            {props.parser.variableRows.length} rows
          </span>
        </div>

        {props.parser.variableRows.length > 0 && (
          <div className={styles.varHeaderRow}>
            <span className={styles.varHeaderLabel}>Variable Key</span>
            <span className={styles.varHeaderLabel}>Replacement Value</span>
            <span></span>
          </div>
        )}

        <div className={styles.variablesList}>
          {props.parser.variableRows.length === 0 ? (
            <p className={styles.emptyLogs}>
              No variables defined. Click "Add Variable" to define some.
            </p>
          ) : (
            props.parser.variableRows.map((row) => (
              <div key={row.id} className={styles.varRow}>
                <input
                  type="text"
                  className={styles.inputMono}
                  placeholder="e.g. name"
                  value={row.key}
                  onChange={(e) =>
                    props.parser.updateVariableRow(row.id, {
                      key: e.target.value,
                    })
                  }
                  disabled={props.parser.isLoading}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Ada"
                  value={row.value}
                  onChange={(e) =>
                    props.parser.updateVariableRow(row.id, {
                      value: e.target.value,
                    })
                  }
                  disabled={props.parser.isLoading}
                />
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => props.parser.deleteVariableRow(row.id)}
                  disabled={props.parser.isLoading}
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
          onClick={props.parser.addVariableRow}
          disabled={props.parser.isLoading}
        >
          ＋ Add Variable
        </button>
        <button
          type="button"
          className={styles.parseButton}
          onClick={props.parser.parseTemplate}
          disabled={props.parser.isLoading}
        >
          {props.parser.isLoading ? (
            <>
              <div className={styles.spinner} /> Processing...
            </>
          ) : (
            <>⚡ Compile & Parse</>
          )}
        </button>
      </div>
    </section>
  );
}
