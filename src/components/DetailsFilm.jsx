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
      {!data && !err && <div>Loading…</div>}
      {err && <div>{err}</div>}
      {data && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <h2 style={{ margin:0 }}>{data.title}</h2>
            <button onClick={onClose} style={{ border:"1px solid #000", background:"transparent", padding:"6px 10px", borderRadius:8, cursor:"pointer" }}>Close</button>
          </div>
          <div style={{ color:"#333", marginBottom:10 }}>{data.description}</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:12, fontSize:14 }}>
            <span><strong>Year:</strong> {data.release_year}</span>
            <span><strong>Rating:</strong> {data.rating}</span>
            <span><strong>Length:</strong> {data.length} min</span>
            <span><strong>Rate:</strong> ${Number(data.rental_rate).toFixed(2)}</span>
          </div>
          <div style={{ marginBottom:10, fontSize:14 }}>
            <strong>Categories:</strong> {data.categories.join(", ")}
          </div>
          <div style={{ fontSize:14 }}>
            <strong>Actors:</strong> {data.actors.map(a => `${a.first_name} ${a.last_name}`).join(", ")}
          </div>
        </div>
      )}
    </Details>
  );
}
