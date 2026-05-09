import { useState } from "react";
import styles from "./TemplatePage.module.css";
import { TemplateInput } from "../TemplateInput/TemplateInput";
import { VariablesInput } from "../VariablesInput/VariablesInput";
import { ParseResultDisplay } from "../ParseResultDisplay/ParseResultDisplay";
import { useParseTemplateMutation } from "../../infrastructure/store/template-mutations";

interface TemplatePageState {
  template: string;
  variables: Record<string, string | null>;
}

function TemplatePage() {
  const [state, setState] = useState<TemplatePageState>({
    template: "",
    variables: {},
  });

  const mutation = useParseTemplateMutation();

  const handleParse = () => {
    mutation.mutate({
      template: state.template,
      variables: state.variables,
    });
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Template Engine</h1>
      <TemplateInput
        value={state.template}
        onChange={(template) =>
          setState((prev) => ({ ...prev, template }))
        }
      />
      <VariablesInput
        variables={state.variables}
        onChange={(variables) =>
          setState((prev) => ({ ...prev, variables }))
        }
      />
      <button
        type="button"
        className={styles.parseButton}
        onClick={handleParse}
      >
        Parse
      </button>
      {mutation.isError && (
        <p className={styles.error}>
          {(mutation.error as Error).message}
        </p>
      )}
      {mutation.isSuccess && (
        <ParseResultDisplay result={mutation.data} />
      )}
    </main>
  );
}

export { TemplatePage };
