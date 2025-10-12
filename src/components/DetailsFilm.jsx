import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Details from "./Details.jsx";

export default function DetailsFilm({ filmId, open, onClose }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open || !filmId) return;
    setData(null);
    setErr("");
    (async () => {
      try {
        const { data } = await api.get(`/films/${filmId}`);
        setData(data);
      } catch {
        setErr("Failed to load film.");
      }
    })();
  }, [open, filmId]);

  return (
    <Details open={open} onClose={onClose}>
      {!data && !err && <div className="meta">Loading…</div>}
      {err && <div className="meta">{err}</div>}
      {data && (
        <div
          style={{
            background: "var(--surface, #0A1426)",
            color: "var(--text, #E9F2FF)",
            borderRadius: 12,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0, color: "#FFFFFF" }}>{data.title}</h2>
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>

          <div
            style={{
              color: "#AFC3E6",
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            {data.description || "No description available."}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              fontSize: 14,
            }}
          >
            <div>
              <strong>Year:</strong> {data.release_year}
            </div>
            <div>
              <strong>Rating:</strong> {data.rating}
            </div>
            <div>
              <strong>Length:</strong> {data.length} min
            </div>
            <div>
              <strong>Rate:</strong> ${Number(data.rental_rate).toFixed(2)}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <strong>Categories:</strong>{" "}
            {(data.categories || []).join(", ") || "—"}
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>Actors:</strong>{" "}
            {(data.actors || [])
              .map((a) => `${a.first_name} ${a.last_name}`)
              .join(", ") || "—"}
          </div>
        </div>
      )}
    </Details>
  );
}



