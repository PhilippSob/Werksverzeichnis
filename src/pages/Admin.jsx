import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { styles } from "../styles.js";

export default function Admin() {
  const { session, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError("Anmeldung fehlgeschlagen: " + error.message);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <section style={styles.textPage}>
          <span style={styles.textEyebrow}>Admin</span>
          <p style={styles.textBody}>Lädt …</p>
        </section>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={styles.textPage}>
        <span style={styles.textEyebrow}>Admin</span>
        <h1 style={styles.textHeading}>{session ? "Angemeldet" : "Anmelden"}</h1>

        {session ? (
          <>
            <p style={styles.textBody}>Angemeldet als {session.user.email}.</p>
            <p style={styles.textBody}>
              Du kannst jetzt auf den Galerie-Seiten Bilder hinzufügen und löschen.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <Link to="/galerie/a5-skizzenblock" className="pf-btn" style={styles.primaryBtn}>
                Zur Galerie
              </Link>
              <button className="pf-btn" style={styles.secondaryBtn} onClick={signOut}>
                Abmelden
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "320px" }}>
            <label style={styles.label}>
              E-Mail
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </label>
            <label style={styles.label}>
              Passwort
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <span style={{ color: "#b5303a", fontSize: "12px" }}>{error}</span>}
            <button className="pf-btn" style={styles.primaryBtn} type="submit" disabled={submitting}>
              {submitting ? "Meldet an …" : "Anmelden"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
