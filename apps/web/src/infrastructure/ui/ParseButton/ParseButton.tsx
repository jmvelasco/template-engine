import styles from "./ParseButton.module.css";

interface Props {
  loading: boolean;
  onClick: () => void;
}

export function ParseButton(props: Props) {
  return (
    <button
      className={props.loading ? styles.buttonDisabled : styles.button}
      type="button"
      onClick={props.onClick}
      disabled={props.loading}
    >
      {props.loading ? "Parsing..." : "Parse Template"}
    </button>
  );
}
