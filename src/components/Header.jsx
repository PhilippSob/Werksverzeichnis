import React from "react";
import { Link, useLocation } from "react-router-dom";
import { styles } from "../styles.js";

const SECTIONS = [
  { key: "werke", label: "Werke", path: "/galerie/a5-skizzenblock", match: (p) => p.startsWith("/galerie/") },
  { key: "about", label: "Über mich", path: "/ueber-mich", match: (p) => p === "/ueber-mich" },
  { key: "contact", label: "Kontakt", path: "/kontakt", match: (p) => p === "/kontakt" },
];

export default function Header() {
  const location = useLocation();
  const current = SECTIONS.find((s) => s.match(location.pathname));
  const otherSections = SECTIONS.filter((s) => s.key !== (current ? current.key : null));

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        {current ? current.label : ""}
      </Link>
      <nav style={styles.nav}>
        {otherSections.map((s) => (
          <Link key={s.key} to={s.path} className="pf-btn" style={styles.navLink}>
            {s.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
