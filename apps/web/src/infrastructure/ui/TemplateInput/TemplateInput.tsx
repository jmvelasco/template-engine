import styles from "./TemplateInput.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function TemplateInput(props: Props) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Template</label>
      <textarea
        className={styles.textarea}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder="Enter your template with ${placeholders}..."
      />
    </div>
  );
}
