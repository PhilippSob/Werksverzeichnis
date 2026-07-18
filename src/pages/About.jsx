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
          Für mich ist Kunst mehr als ein fertiges Werk - sie ist ein Prozess des Entdeckens,
          Hinterfragens und Gestaltens. Ich glaube das Kunst Menschen verbindet, Emotionen weckt
          und Räume mit Bedeutung füllt. 
          Meine Inspiration finde ich in der Natur, im Alltag sowie in Gefühlen und Erlebnissen, 
          die mich prägen.
          Ich freue mich, meine Arbeiten mit Ihnen zu teilen und Sie auf meiner künstlerischen Reise
          willkommen zu heißen.
        </p>
        <p style={styles.textBody}>
          Ich arbeite mit Acryl, meist in gedämpften Tönen, und lasse Bilder oft über längere Zeit
          wachsen. Gemalt wird in Bielefeld / Ostwestfalen-Lippe.
        </p>
      </section>
    </div>
  );
}
