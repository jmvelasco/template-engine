import { createContext, use } from "react";
import styles from "./App.module.css";
import { useTemplateParser, VariableRow } from "./useTemplateParser";
import { ParseEvent } from "../../api/template-parser-client";

// 1. Context definitions for dependency injection
interface TemplateParserState {
  template: string;
  variableRows: VariableRow[];
  parsedText: string;
  events: ParseEvent[];
  isLoading: boolean;
  error: string | null;
}

interface TemplateParserActions {
  setTemplate: (value: string) => void;
  addVariableRow: () => void;
  updateVariableRow: (id: string, updates: Partial<Omit<VariableRow, "id">>) => void;
  deleteVariableRow: (id: string) => void;
  parseTemplate: () => Promise<void>;
}

interface TemplateParserContextValue {
  state: TemplateParserState;
  actions: TemplateParserActions;
}

const TemplateParserContext = createContext<TemplateParserContextValue | null>(null);

function useTemplateParserContext(): TemplateParserContextValue {
  const context = use(TemplateParserContext);
  if (!context) {
    throw new Error(
      "useTemplateParserContext must be used within a TemplateParserProvider",
    );
  }
  return context;
}

// 2. Compound Components implementation
function TemplateParserProvider({ children }: { children: React.ReactNode }) {
  const parser = useTemplateParser();

  const contextValue: TemplateParserContextValue = {
    state: {
      template: parser.template,
      variableRows: parser.variableRows,
      parsedText: parser.parsedText,
      events: parser.events,
      isLoading: parser.isLoading,
      error: parser.error,
    },
    actions: {
      setTemplate: parser.setTemplate,
      addVariableRow: parser.addVariableRow,
      updateVariableRow: parser.updateVariableRow,
      deleteVariableRow: parser.deleteVariableRow,
      parseTemplate: parser.parseTemplate,
    },
  };

  return (
    <TemplateParserContext value={contextValue}>
      {children}
    </TemplateParserContext>
  );
}

function TemplateParserHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span> Template Engine
      </h1>
      <p className={styles.subtitle}>
        Parse variables into template strings instantly using a high-fidelity,
        pure, and side-effect free compiler.
      </p>
    </header>
  );
}

function TemplateParserEditorCard({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.glassCard}>
      <h2 className={styles.sectionTitle}>⚙️ Editor Configuration</h2>
      {children}
    </section>
  );
}

function TemplateParserTemplateInput() {
  const {
    state: { template, isLoading },
    actions: { setTemplate },
  } = useTemplateParserContext();

  return (
    <div className={styles.formGroup}>
      <label htmlFor="template-textarea" className={styles.label}>
        Template String
      </label>
      <textarea
        id="template-textarea"
        className={styles.textarea}
        placeholder="Enter your template here, e.g. Hello, ${name}!"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
}

function TemplateParserVariablesManager() {
  const {
    state: { variableRows, isLoading },
    actions: { updateVariableRow, deleteVariableRow },
  } = useTemplateParserContext();

  return (
    <div className={styles.variablesWrapper}>
      <div className={styles.logsHeader}>
        <label className={styles.label}>Variables Dictionary</label>
        <span className={styles.badge}>{variableRows.length} rows</span>
      </div>

      {variableRows.length > 0 && (
        <div className={styles.varHeaderRow}>
          <span className={styles.varHeaderLabel}>Variable Key</span>
          <span className={styles.varHeaderLabel}>Replacement Value</span>
          <span></span>
        </div>
      )}

      <div className={styles.variablesList}>
        {variableRows.length === 0 ? (
          <p className={styles.emptyLogs}>
            No variables defined. Click "Add Variable" to define some.
          </p>
        ) : (
          variableRows.map((row) => (
            <div key={row.id} className={styles.varRow}>
              <input
                type="text"
                className={`${styles.input} ${styles.inputMono}`}
                placeholder="e.g. name"
                value={row.key}
                onChange={(e) =>
                  updateVariableRow(row.id, { key: e.target.value })
                }
                disabled={isLoading}
              />
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Ada"
                value={row.value}
                onChange={(e) =>
                  updateVariableRow(row.id, { value: e.target.value })
                }
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => deleteVariableRow(row.id)}
                disabled={isLoading}
                title="Delete variable"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TemplateParserActions() {
  const {
    state: { isLoading },
    actions: { addVariableRow, parseTemplate },
  } = useTemplateParserContext();

  return (
    <div className={styles.actionButtons}>
      <button
        type="button"
        className={styles.addButton}
        onClick={addVariableRow}
        disabled={isLoading}
      >
        ＋ Add Variable
      </button>
      <button
        type="button"
        className={styles.parseButton}
        onClick={parseTemplate}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className={styles.spinner} /> Processing...
          </>
        ) : (
          <>⚡ Compile & Parse</>
        )}
      </button>
    </div>
  );
}

function TemplateParserOutputCard({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.glassCard}>
      <h2 className={styles.sectionTitle}>🔮 Compile Output</h2>
      {children}
    </section>
  );
}

function TemplateParserError() {
  const {
    state: { error },
  } = useTemplateParserContext();

  if (!error) return null;

  return (
    <div className={styles.errorMessage}>
      <span>⚠️</span>
      <div>
        <strong>Error:</strong> {error}
      </div>
    </div>
  );
}

function TemplateParserResult() {
  const {
    state: { parsedText },
  } = useTemplateParserContext();

  return (
    <>
      <div className={`${styles.label} ${styles.outputLabel}`}>
        Parsed Result
      </div>
      <div className={styles.outputArea}>
        {parsedText ? (
          parsedText
        ) : (
          <span className={styles.placeholderOutput}>
            Your parsed template output will appear here after clicking
            "Compile & Parse"...
          </span>
        )}
      </div>
    </>
  );
}

function TemplateParserLogs() {
  const {
    state: { events },
  } = useTemplateParserContext();

  return (
    <div className={styles.logsSection}>
      <div className={styles.logsHeader}>
        <div className={styles.label}>Execution Event Logs</div>
        {events.length > 0 && (
          <span className={styles.badge}>{events.length} logs</span>
        )}
      </div>

      <div className={styles.logTimeline}>
        {events.length === 0 ? (
          <p className={styles.emptyLogs}>
            No parse logs recorded yet. Compile a template to see notified
            logs.
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className={`${styles.logItem} ${
                event.type === "SUCCESS" ? styles.logSuccess : styles.logWarning
              }`}
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
  );
}

// 3. Consolidated Compound Component API
export const TemplateParser = {
  Provider: TemplateParserProvider,
  Header: TemplateParserHeader,
  EditorCard: TemplateParserEditorCard,
  TemplateInput: TemplateParserTemplateInput,
  VariablesManager: TemplateParserVariablesManager,
  Actions: TemplateParserActions,
  OutputCard: TemplateParserOutputCard,
  Error: TemplateParserError,
  Result: TemplateParserResult,
  Logs: TemplateParserLogs,
};

// 4. Main App Component
export function App() {
  return (
    <TemplateParser.Provider>
      <div className={styles.container}>
        <TemplateParser.Header />

        <main className={styles.mainLayout}>
          {/* Left column: Inputs & Settings */}
          <TemplateParser.EditorCard>
            <TemplateParser.TemplateInput />
            <TemplateParser.VariablesManager />
            <TemplateParser.Actions />
          </TemplateParser.EditorCard>

          {/* Right column: Output & Logs */}
          <TemplateParser.OutputCard>
            <TemplateParser.Error />
            <TemplateParser.Result />
            <TemplateParser.Logs />
          </TemplateParser.OutputCard>
        </main>
      </div>
    </TemplateParser.Provider>
  );
}
