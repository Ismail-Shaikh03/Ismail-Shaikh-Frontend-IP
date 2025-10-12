import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import Details from "./Details.jsx";

export default function DetailsActor({ actorId, open, onClose, onOpenFilm }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open || !actorId) return;
    setData(null);
    setErr("");
    (async () => {
      try {
        const { data } = await api.get(`/actors/${actorId}`);
        setData(data);
      } catch {
        setErr("Failed to load actor.");
      }
    })();
  }, [open, actorId]);

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
            <h2 style={{ margin: 0, color: "#FFFFFF" }}>
              {data.actor.first_name} {data.actor.last_name}
            </h2>
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>

          <div>
            <h3 style={{ margin: "12px 0 8px 0", color: "#FFFFFF" }}>
              Top 5 Rented Films
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {data.topFilms.map((f) => (
                <li
                  key={f.film_id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#E9F2FF" }}>
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#AFC3E6",
                        marginTop: 2,
                      }}
                    >
                      Rentals: {f.rented}
                    </div>
                  </div>
                  {onOpenFilm && (
                    <button
                      className="btn"
                      onClick={() => onOpenFilm(f.film_id)}
                    >
                      View
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Details>
  );
}

