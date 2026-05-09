import { useState } from "react";
import styles from "./VariablesInput.module.css";

interface VariablesInputProps {
  variables: Record<string, string | null>;
  onChange: (variables: Record<string, string | null>) => void;
}

function VariablesInput(props: VariablesInputProps) {
  const [inputState, setInputState] = useState({ key: "", value: "" });

  const handleAdd = () => {
    if (inputState.key === "") return;
    props.onChange({ ...props.variables, [inputState.key]: inputState.value });
    setInputState({ key: "", value: "" });
  };

  const handleRemove = (keyToRemove: string) => {
    const updated = { ...props.variables };
    delete updated[keyToRemove];
    props.onChange(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <label>
          Key
          <input
            type="text"
            value={inputState.key}
            onChange={(e) =>
              setInputState((prev) => ({ ...prev, key: e.target.value }))
            }
          />
        </label>
        <label>
          Value
          <input
            type="text"
            value={inputState.value}
            onChange={(e) =>
              setInputState((prev) => ({ ...prev, value: e.target.value }))
            }
          />
        </label>
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
      <ul className={styles.list}>
        {Object.entries(props.variables).map(([key, value]) => (
          <li key={key} className={styles.item}>
            <span>{key}</span>
            <span>{value}</span>
            <button
              type="button"
              aria-label={`Remove ${key}`}
              onClick={() => handleRemove(key)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { VariablesInput };
