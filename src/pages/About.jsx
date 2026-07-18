import React from "react";
import Header from "../components/Header.jsx";
import { styles } from "../styles.js";

export default function About() {
  return (
    <div style={styles.page}>
      <Header />
      <section style={styles.textPage} className="pf-fade">
        <span style={styles.textEyebrow}>Über mich</span>
        <h1 style={styles.textHeading}>Philipp Sobioch</h1>
        <p style={styles.textBody}>
          Ich male zwischen zwei Polen: atmosphärische, farbfeldartige Abstraktionen und
          symbolisch-figurative Arbeiten. Am meisten trägt zurzeit meine urbane Grau-Grün-Serie —
          ruhige, leicht melancholische Stadtbilder, die mehr über Stimmung erzählen als über Orte.
        </p>
        <p style={styles.textBody}>
          Ich arbeite mit Acryl, meist in gedämpften Tönen, und lasse Bilder oft über längere Zeit
          wachsen. Gemalt wird in Bielefeld / Ostwestfalen-Lippe.
        </p>
        <p style={styles.textNote}>
          (Platzhaltertext — ersetze diesen Absatz in src/pages/About.jsx durch deinen eigenen.)
        </p>
      </section>
    </div>
  );
}
