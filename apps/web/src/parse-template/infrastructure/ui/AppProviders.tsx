import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TemplateUseCasesContext } from "../context/template-use-cases-context";
import type { TemplateUseCases } from "../context/template-use-cases-context";
import React from "react";

const queryClient = new QueryClient();

interface AppProvidersProps {
  useCases: TemplateUseCases;
  children: React.ReactNode;
}

function AppProviders(props: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TemplateUseCasesContext.Provider value={props.useCases}>
        {props.children}
      </TemplateUseCasesContext.Provider>
    </QueryClientProvider>
  );
}

export { AppProviders };
