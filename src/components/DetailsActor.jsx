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
      {!data && !err && <div>Loading…</div>}
      {err && <div>{err}</div>}
      {data && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <h2 style={{ margin:0 }}>{data.actor.first_name} {data.actor.last_name}</h2>
            <button onClick={onClose} style={{ border:"1px solid #000", background:"transparent", padding:"6px 10px", borderRadius:8, cursor:"pointer" }}>Close</button>
          </div>
          <div style={{ marginBottom:12, fontSize:14 }}>
          </div>
          <div>
            <h3 style={{ margin:"12px 0 8px 0" }}>Top 5 Rented Films</h3>
            <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:8 }}>
              {data.topFilms.map(f => (
                <li key={f.film_id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid #ddd", borderRadius:8, padding:"8px 12px" }}>
                  <div>
                    <div style={{ fontWeight:700 }}>{f.title}</div>
                    <div style={{ fontSize:12, color:"#555" }}>Rentals: {f.rented}</div>
                  </div>
                  {onOpenFilm && (
                    <button
                      onClick={() => onOpenFilm(f.film_id)}
                      style={{ border:"1px solid #000", background:"transparent", padding:"6px 10px", borderRadius:8, cursor:"pointer" }}
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
