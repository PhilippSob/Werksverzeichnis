import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import Landing from "./pages/Landing.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/galerie/a5-skizzenblock"
          element={<Gallery category="a5" title="Galerie – A5 Skizzenblock" />}
        />
        <Route
          path="/galerie/keilrahmen"
          element={<Gallery category="keilrahmen" title="Galerie – Keilrahmen" />}
        />
        <Route path="/ueber-mich" element={<About />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AuthProvider>
  );
}
