import styles from "./TemplateInput.module.css";

interface TemplateInputProps {
  value: string;
  onChange: (value: string) => void;
}

function TemplateInput(props: TemplateInputProps) {
  return (
    <label className={styles.container}>
      Template
      <textarea
        className={styles.textarea}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

export { TemplateInput };
