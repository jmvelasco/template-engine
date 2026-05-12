import type { TemplateEnginePort } from "../../../domain/TemplateEnginePort";
import { useTemplateEngine } from "../useTemplateEngine.hook";
import { TemplateInput } from "../TemplateInput/TemplateInput";
import { VariablesEditor } from "../VariablesEditor/VariablesEditor";
import { ParseButton } from "../ParseButton/ParseButton";
import { ResultDisplay } from "../ResultDisplay/ResultDisplay";
import { ProcessingLog } from "../ProcessingLog/ProcessingLog";
import styles from "./App.module.css";

interface Props {
  templateEngine: TemplateEnginePort;
}

export function App(props: Props) {
  const hook = useTemplateEngine(props.templateEngine);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Template Engine</h1>
      <TemplateInput value={hook.template} onChange={hook.updateTemplate} />
      <VariablesEditor
        variables={hook.variables}
        onAdd={hook.addVariable}
        onRemove={hook.removeVariable}
        onUpdateKey={hook.updateVariableKey}
        onUpdateValue={hook.updateVariableValue}
      />
      <ParseButton loading={hook.loading} onClick={hook.parse} />
      {hook.error && <div className={styles.error}>{hook.error}</div>}
      {hook.result && (
        <>
          <ResultDisplay result={hook.result} />
          <ProcessingLog notifications={hook.result.notifications} />
        </>
      )}
    </div>
  );
}
