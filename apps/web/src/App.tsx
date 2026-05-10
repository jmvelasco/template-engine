import { useTemplateParser } from "./hooks/useTemplateParser";
import { parseTemplate } from "./services/apiClient";
import { TemplateForm } from "./components/TemplateForm/TemplateForm";
import { VariableTable } from "./components/VariableTable/VariableTable";
import { ResultPresenter } from "./components/ResultPresenter/ResultPresenter";
import { NotificationPanel } from "./components/NotificationPanel/NotificationPanel";
import styles from "./App.module.css";

export function App() {
  const parser = useTemplateParser({ parseTemplate });

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>{"{}"}</div>
          <h1 className={styles.logoText}>
            Antigravity <span className={styles.logoTextAccent}>Parser</span>
          </h1>
        </div>
        <div className={styles.badge}>v1.0.0-beta</div>
      </header>

      <main className={styles.grid}>
        <section className={styles.column}>
          <TemplateForm
            templateContent={parser.templateContent}
            isParsing={parser.isParsing}
            onUpdateTemplateContent={parser.updateTemplateContent}
            onSubmit={parser.parse}
          />
          <VariableTable
            variables={parser.variables}
            onAddVariable={parser.addVariable}
            onUpdateVariableKey={parser.updateVariableKey}
            onUpdateVariableValue={parser.updateVariableValue}
            onRemoveVariable={parser.removeVariable}
          />
        </section>

        <section className={styles.column}>
          <ResultPresenter result={parser.result} error={parser.error} />
          <NotificationPanel
            notifications={parser.result.fold(
              () => [],
              (res) => res.notifications,
            )}
          />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>
          Designed & Built with 💜 by{" "}
          <a
            href="https://github.com/jmvelasco/template-engine"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Extreme Programming Agent
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
