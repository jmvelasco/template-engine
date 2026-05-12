import styles from "./TemplateParser.module.css";
import { useTemplateParser } from "./TemplateParser.hook";
import { ParseTemplateUseCase } from "../../../application/use-cases/parse-template.use-case";
import { WebFactory } from "../../factory/web-factory";
import { TemplateHeader } from "../TemplateHeader/TemplateHeader";
import { EditorConfiguration } from "../EditorConfiguration/EditorConfiguration";
import { CompileOutput } from "../CompileOutput/CompileOutput";

interface Props {
  useCase: ParseTemplateUseCase;
}

// Presentational Component (Testable - receives dependencies via props)
export function TemplateParser(props: Props) {
  // Always consume hook using hook.property pattern (never destructure)
  const parser = useTemplateParser(props.useCase);

  return (
    <div className={styles.container}>
      <TemplateHeader />

      <main className={styles.mainLayout}>
        {/* Left column: Inputs & Settings */}
        <EditorConfiguration parser={parser} />

        {/* Right column: Output & Logs */}
        <CompileOutput parser={parser} />
      </main>
    </div>
  );
}

// Container Component (Wiring - instantiated at application boundary/routes)
export function TemplateParserContainer() {
  const useCase = WebFactory.createParseTemplateUseCase();
  return <TemplateParser useCase={useCase} />;
}
