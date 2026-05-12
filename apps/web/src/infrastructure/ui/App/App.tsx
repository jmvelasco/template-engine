import React from "react";
import styles from "./App.module.css";

interface AppProps {}

export function App(props: AppProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Template Engine</h1>
      </header>
      <main className={styles.main}>
        <p>Welcome to the Template Engine Web UI. Scaffolding is complete.</p>
      </main>
    </div>
  );
}
