import type { VariableRow } from "../../hooks/useTemplateParser";
import styles from "./VariableTable.module.css";

export interface VariableTableProps {
  variables: VariableRow[];
  onAddVariable: () => void;
  onUpdateVariableKey: (id: string, key: string) => void;
  onUpdateVariableValue: (id: string, value: string | null) => void;
  onRemoveVariable: (id: string) => void;
}

export function VariableTable(props: VariableTableProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Placeholder Variables</h3>
        <button
          type="button"
          onClick={props.onAddVariable}
          className={styles.addButton}
          aria-label="Add variable row"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Row
        </button>
      </div>

      <div className={styles.tableContainer}>
        {props.variables.length === 0 ? (
          <div className={styles.emptyState}>
            No variables defined. Click "Add Row" to start adding template
            placeholders.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell} style={{ width: "40%" }}>
                  Key
                </th>
                <th className={styles.tableHeaderCell} style={{ width: "40%" }}>
                  Value
                </th>
                <th
                  className={styles.tableHeaderCell}
                  style={{ width: "20%", textAlign: "right" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {props.variables.map((row) => (
                <tr key={row.id} className={styles.row}>
                  <td className={styles.cell}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. name"
                      value={row.key}
                      onChange={(e) =>
                        props.onUpdateVariableKey(row.id, e.target.value)
                      }
                      aria-label={`Variable key for row ${row.id}`}
                    />
                  </td>
                  <td className={styles.cell}>
                    {row.value === null ? (
                      <span className={styles.nullBadge}>[NULL / IGNORED]</span>
                    ) : (
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Ada Lovelace"
                        value={row.value}
                        onChange={(e) =>
                          props.onUpdateVariableValue(row.id, e.target.value)
                        }
                        aria-label={`Variable value for row ${row.id}`}
                      />
                    )}
                  </td>
                  <td className={styles.cell} style={{ textAlign: "right" }}>
                    <div
                      className={styles.actionCell}
                      style={{ justifyContent: "flex-end" }}
                    >
                      <button
                        type="button"
                        className={styles.nullButton}
                        onClick={() =>
                          props.onUpdateVariableValue(
                            row.id,
                            row.value === null ? "" : null,
                          )
                        }
                        aria-label={
                          row.value === null
                            ? "Set variable value to string"
                            : "Set variable value to null"
                        }
                      >
                        {row.value === null ? "Set String" : "Set Null"}
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => props.onRemoveVariable(row.id)}
                        aria-label="Remove variable row"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
export default VariableTable;
