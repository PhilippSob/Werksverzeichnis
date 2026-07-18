import React from "react";
import Header from "../components/Header.jsx";
import { styles } from "../styles.js";

export default function Contact() {
  return (
    <div style={styles.page}>
      <Header />
      <section style={styles.textPage} className="pf-fade">
        <span style={styles.textEyebrow}>Kontakt</span>
        <h1 style={styles.textHeading}>Kontakt</h1>
        <div style={styles.contactBlock}>
          <span style={styles.contactLine}>Philipp Sobioch</span>
          <span style={styles.contactLine}>Hobusch 12</span>
          <span style={styles.contactLine}>33619 Bielefeld</span>
          <a href="mailto:philippsobioch@yahoo.de" style={styles.contactLink}>
            philippsobioch@yahoo.de
          </a>
        </div>
      </section>
    </div>
  );
}
