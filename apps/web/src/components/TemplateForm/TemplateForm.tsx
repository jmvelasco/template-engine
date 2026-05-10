import styles from "./TemplateForm.module.css";

export interface TemplateFormProps {
  templateContent: string;
  isParsing: boolean;
  onUpdateTemplateContent: (content: string) => void;
  onSubmit: () => void;
}

export function TemplateForm(props: TemplateFormProps) {
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    props.onSubmit();
  };
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h3 className={styles.title}>Template Content</h3>
      <textarea
        className={styles.textarea}
        placeholder="Enter your template text with placeholders like ${variable_name}..."
        value={props.templateContent}
        onChange={(e) => props.onUpdateTemplateContent(e.target.value)}
        disabled={props.isParsing}
        aria-label="Template text input"
      />
      <button
        type="submit"
        className={styles.submitButton}
        disabled={props.isParsing}
        aria-label="Process Template"
      >
        {props.isParsing ? (
          <>
            <span className={styles.loader} role="status" aria-hidden="true" />
            Parsing Template...
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Process Template
          </>
        )}
      </button>
    </form>
  );
}
