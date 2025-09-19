import { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Top5Film() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/landing/top-films");
        setRows(data);
      } catch {
        setErr("Failed to load films.");
      }
    })();
  }, []);

  return (
    <section className="panel">
      <h2 style={{marginTop:0}}>Top 5 Rented Films</h2>
      {err && <p className="meta">{err}</p>}
      {!rows ? (
        <ul className="list">{Array.from({length:5}).map((_,i)=><li key={i} className="skel" />)}</ul>
      ) : (
        <ul className="list">
          {rows.map((f, i) => (
            <li className="card" key={f.film_id}>
              <div style={{display:"flex", gap:12, alignItems:"center"}}>
                <div className="rank">{i+1}</div>
                <div>
                  <div style={{fontWeight:700}}>{f.title}</div>
                  <div className="meta">Rentals: {f.rentals}</div>
                </div>
              </div>
              <button
                style={{
                  background:"transparent", color:"#fff", border:"1px solid #fff",
                  borderRadius:8, padding:"6px 10px", cursor:"pointer"
                }}
              >
                Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
