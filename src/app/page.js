import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/frame/1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pilih Frame
          </a>
        </div>
      </main>
    </div>
  );
}
