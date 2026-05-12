import styles from "./VariablesEditor.module.css";

interface VariableRow {
  key: string;
  value: string;
}

interface Props {
  variables: VariableRow[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdateKey: (index: number, key: string) => void;
  onUpdateValue: (index: number, value: string) => void;
}

export function VariablesEditor(props: Props) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Variables</label>
      <div className={styles.rows}>
        {props.variables.map((variable, index) => (
          <div className={styles.row} key={index}>
            <input
              className={styles.input}
              type="text"
              placeholder="key"
              value={variable.key}
              onChange={(e) => props.onUpdateKey(index, e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="value"
              value={variable.value}
              onChange={(e) => props.onUpdateValue(index, e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => props.onRemove(index)}
              aria-label="Remove variable"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button className={styles.addButton} type="button" onClick={props.onAdd}>
        + Add variable
      </button>
    </div>
  );
}
