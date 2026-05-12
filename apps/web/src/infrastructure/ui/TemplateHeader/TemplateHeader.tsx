import styles from "./TemplateHeader.module.css";

export function TemplateHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span> Template Engine
      </h1>
      <p className={styles.subtitle}>
        Parse variables into template strings instantly using a high-fidelity,
        pure, and side-effect free compiler.
      </p>
    </header>
  );
}
