import { AppProviders } from "../infrastructure/ui/AppProviders";
import { ApiParseTemplateUseCase } from "../infrastructure/api/api-parse-template-use-case";
import { TemplatePage } from "./TemplatePage/TemplatePage";

function createUseCases() {
  return {
    parseTemplate: new ApiParseTemplateUseCase(),
  };
}

function TemplateWiredPage() {
  const useCases = createUseCases();

  return (
    <AppProviders useCases={useCases}>
      <TemplatePage />
    </AppProviders>
  );
}

export { TemplateWiredPage };
