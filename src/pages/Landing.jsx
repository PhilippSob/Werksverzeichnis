import React from "react";
import { Link } from "react-router-dom";
import { serif, sans, mono } from "../styles.js";

const SKY_IMAGE = "/sky.jpg";

export default function Landing() {
  return (
    <div style={styles.wrap}>
      <img src={SKY_IMAGE} alt="Blauer Himmel mit Wolken" style={styles.bgImage} />
      <div style={styles.overlay} />

      <header style={styles.header}>
        <span />
        <nav style={styles.nav}>
          <Link to="/galerie/a5-skizzenblock" style={styles.navLink}>
            Werke
          </Link>
          <Link to="/ueber-mich" style={styles.navLink}>
            Über mich
          </Link>
          <Link to="/kontakt" style={styles.navLink}>
            Kontakt
          </Link>
        </nav>
      </header>

      <main style={styles.hero}>
        <span style={styles.eyebrow}>Malerei · Bielefeld / OWL</span>
        <h1 style={styles.heading}>Philipp Sobioch</h1>
        <p style={styles.subtitle}>
          Atmosphärische Abstraktion und figurative Malerei — zwischen Stimmung und Stadt.
        </p>
        <Link to="/galerie/a5-skizzenblock" className="pf-btn" style={styles.cta}>
          Werke entdecken
          <span aria-hidden="true">→</span>
        </Link>
      </main>
    </div>
  );
}

const styles = {
  wrap: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(10,18,30,0.32) 0%, rgba(10,18,30,0.05) 30%, rgba(10,18,30,0.05) 55%, rgba(20,10,18,0.55) 100%)",
    zIndex: 1,
  },
  header: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 28px",
  },
  nav: {
    display: "flex",
    gap: "22px",
  },
  navLink: {
    fontFamily: sans,
    fontSize: "12.5px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    color: "#fdfbf3",
    textDecoration: "none",
    textShadow: "0 1px 8px rgba(10,18,30,0.35)",
  },
  hero: {
    position: "relative",
    zIndex: 2,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px 24px 110px",
    gap: "16px",
  },
  eyebrow: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#fdfbf3",
    textShadow: "0 1px 10px rgba(10,18,30,0.4)",
  },
  heading: {
    fontFamily: serif,
    fontStyle: "italic",
    fontWeight: 500,
    fontSize: "clamp(40px, 7vw, 76px)",
    color: "#fdfbf3",
    margin: 0,
    textShadow: "0 2px 20px rgba(10,18,30,0.4)",
  },
  subtitle: {
    fontFamily: sans,
    fontSize: "15.5px",
    color: "#fdfbf3",
    maxWidth: "440px",
    lineHeight: 1.6,
    margin: "0 0 8px",
    textShadow: "0 1px 10px rgba(10,18,30,0.4)",
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    background: "#a4275a",
    color: "#fdfbf3",
    border: "1px solid #a4275a",
    borderRadius: "3px",
    padding: "13px 24px",
    fontFamily: sans,
    fontSize: "13.5px",
    fontWeight: 500,
    letterSpacing: "0.03em",
    textDecoration: "none",
    boxShadow: "0 10px 30px rgba(20,10,18,0.25)",
  },
};
