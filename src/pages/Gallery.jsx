import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, X, Trash2, ImageOff } from "lucide-react";
import Header from "../components/Header.jsx";
import { styles } from "../styles.js";
import { supabase, ARTWORKS_TABLE, ARTWORKS_BUCKET } from "../supabaseClient.js";
import { compressImage, formatDate } from "../imageUtils.js";
import { useAuth } from "../AuthContext.jsx";

export default function Gallery({ category, title }) {
  const { session } = useAuth();
  const isAdmin = !!session;

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState(null);
  const [workTitle, setWorkTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const carouselRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  const loadArtworks = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from(ARTWORKS_TABLE)
      .select("*")
      .eq("category", category)
      .order("date", { ascending: false });
    if (error) {
      setLoadError("Werke konnten nicht geladen werden. Prüfe die Supabase-Einrichtung.");
      setArtworks([]);
    } else {
      setArtworks(data || []);
    }
    setLoading(false);
  }, [category]);

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIndex(0);
    loadArtworks();
  }, [loadArtworks]);

  useEffect(() => {
    if (!artworks.length || paused || prefersReducedMotion.current) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % artworks.length);
    }, 6500);
    return () => clearInterval(t);
  }, [artworks.length, paused]);

  useEffect(() => {
    if (index >= artworks.length) setIndex(0);
  }, [artworks.length, index]);

  const goPrev = () => setIndex((i) => (artworks.length ? (i - 1 + artworks.length) % artworks.length : 0));
  const goNext = () => setIndex((i) => (artworks.length ? (i + 1) % artworks.length : 0));

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  };

  const onFileChosen = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file || !isAdmin) return;
    setPendingFile(file);
    setWorkTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    try {
      const { previewUrl } = await compressImage(file, 900, 0.7);
      setPendingPreview(previewUrl);
      setShowForm(true);
    } catch (err) {
      setLoadError("Bild konnte nicht gelesen werden.");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setPendingFile(null);
    setPendingPreview(null);
  };

  const saveArtwork = async () => {
    if (!pendingFile || !isAdmin) return;
    setSaving(true);
    try {
      const { blob } = await compressImage(pendingFile, 1400, 0.78);
      const path = `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(ARTWORKS_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(ARTWORKS_BUCKET).getPublicUrl(path);

      const { error: insertError } = await supabase.from(ARTWORKS_TABLE).insert({
        title: workTitle.trim() || "Ohne Titel",
        date,
        category,
        image_url: publicUrlData.publicUrl,
        storage_path: path,
      });
      if (insertError) throw insertError;

      await loadArtworks();
      setIndex(0);
      cancelForm();
    } catch (err) {
      setLoadError("Speichern fehlgeschlagen: " + (err.message || "unbekannter Fehler"));
    } finally {
      setSaving(false);
    }
  };

  const deleteArtwork = async (artwork) => {
    setConfirmDeleteId(null);
    if (!isAdmin) return;
    try {
      if (artwork.storage_path) {
        await supabase.storage.from(ARTWORKS_BUCKET).remove([artwork.storage_path]);
      }
      const { error } = await supabase.from(ARTWORKS_TABLE).delete().eq("id", artwork.id);
      if (error) throw error;
      await loadArtworks();
    } catch (err) {
      setLoadError("Löschen fehlgeschlagen: " + (err.message || "unbekannter Fehler"));
    }
  };

  const current = artworks[index];

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.subNav}>
        <Link
          to="/galerie/a5-skizzenblock"
          className="pf-btn"
          style={{ ...styles.subNavLink, ...(category === "a5" ? styles.subNavLinkActive : {}) }}
        >
          A5 Skizzenblock
        </Link>
        <Link
          to="/galerie/keilrahmen"
          className="pf-btn"
          style={{ ...styles.subNavLink, ...(category === "keilrahmen" ? styles.subNavLinkActive : {}) }}
        >
          Keilrahmen
        </Link>
      </div>

      <main
        style={styles.carouselWrap}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={onKeyDown}
        tabIndex={0}
        ref={carouselRef}
        aria-label="Bilderkarussell"
      >
        {loading ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyText}>Lädt …</span>
          </div>
        ) : !artworks.length ? (
          <div style={styles.emptyState}>
            <ImageOff size={28} strokeWidth={1} color="#8a8e78" />
            <span style={styles.emptyText}>Noch keine Werke in dieser Galerie.</span>
          </div>
        ) : (
          <>
            <div style={styles.imageStage} key={current.id} className="pf-fade">
              <img src={current.image_url} alt={current.title} style={styles.image} />
              <div style={styles.vignette} />
              <div style={styles.dateRail}>
                <span style={styles.dateRailText}>{formatDate(current.date)}</span>
              </div>
              <div style={styles.caption}>
                <span style={styles.captionTitle}>{current.title}</span>
                <span style={styles.captionCount}>
                  {String(index + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}
                </span>
              </div>
              {isAdmin && (
                <button
                  className="pf-btn pf-icon"
                  style={styles.deleteCurrent}
                  onClick={() => setConfirmDeleteId(current.id)}
                  aria-label="Bild löschen"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              )}
            </div>

            {artworks.length > 1 && (
              <>
                <button className="pf-btn pf-icon" style={{ ...styles.navBtn, left: 18 }} onClick={goPrev} aria-label="Vorheriges Bild">
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button className="pf-btn pf-icon" style={{ ...styles.navBtn, right: 18 }} onClick={goNext} aria-label="Nächstes Bild">
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </>
            )}
          </>
        )}
      </main>

      {artworks.length > 0 && (
        <section style={styles.archive}>
          <div style={styles.archiveHeader}>{title}</div>
          <div style={styles.grid}>
            {artworks.map((a, i) => (
              <button
                key={a.id}
                className="pf-thumb pf-btn"
                style={{
                  ...styles.thumbWrap,
                  borderColor: i === index ? "#a4275a" : "transparent",
                }}
                onClick={() => setIndex(i)}
              >
                <img src={a.image_url} alt={a.title} style={styles.thumbImg} />
                <span style={styles.thumbDate}>{formatDate(a.date)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {isAdmin && (
        <div style={styles.addBtnRow}>
          <label className="pf-btn" style={styles.addBtn} htmlFor={`pf-file-input-${category}`}>
            <Plus size={15} strokeWidth={1.75} />
            <span>Bild hinzufügen</span>
            <input
              id={`pf-file-input-${category}`}
              type="file"
              accept="image/*"
              style={styles.hiddenFileInput}
              onChange={onFileChosen}
            />
          </label>
        </div>
      )}

      {showForm && (
        <div style={styles.modalOverlay} onClick={cancelForm}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>Neues Werk — {title}</span>
              <button className="pf-btn pf-icon" onClick={cancelForm} aria-label="Schließen">
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>
            {pendingPreview && <img src={pendingPreview} alt="Vorschau" style={styles.modalPreview} />}
            <label style={styles.label}>
              Titel
              <input
                style={styles.input}
                value={workTitle}
                placeholder="Ohne Titel"
                onChange={(e) => setWorkTitle(e.target.value)}
              />
            </label>
            <label style={styles.label}>
              Datum
              <input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <div style={styles.modalActions}>
              <button className="pf-btn" style={styles.secondaryBtn} onClick={cancelForm}>
                Abbrechen
              </button>
              <button className="pf-btn" style={styles.primaryBtn} onClick={saveArtwork} disabled={saving}>
                {saving ? "Speichert …" : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div style={styles.modalOverlay} onClick={() => setConfirmDeleteId(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <p style={styles.confirmText}>Dieses Bild endgültig entfernen?</p>
            <div style={styles.modalActions}>
              <button className="pf-btn" style={styles.secondaryBtn} onClick={() => setConfirmDeleteId(null)}>
                Abbrechen
              </button>
              <button
                className="pf-btn"
                style={styles.dangerBtn}
                onClick={() => deleteArtwork(artworks.find((a) => a.id === confirmDeleteId))}
              >
                Entfernen
              </button>
            </div>
          </div>
        </div>
      )}

      {loadError && <div style={styles.errorToast}>{loadError}</div>}
    </div>
  );
}
