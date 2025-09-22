import { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Top5Actors() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/landing/top-actors");
        setRows(data);
      } catch {
        setErr("Failed to load actors.");
      }
    })();
  }, []);

  return (
    <section className="panel" style={{flex:1}}>
      <h2 style={{marginTop:0}}>Top 5 Actors In Store</h2>
      {err && <p className="meta">{err}</p>}
      {!rows ? (
        <ul className="list">{Array.from({length:5}).map((_,i)=><li key={i} className="skel" />)}</ul>
      ) : (
        <ul className="list">
          {rows.map((a, i) => (
            <li className="card" key={a.actor_id}>
              <div style={{display:"flex", gap:12, alignItems:"center"}}>
                <div className="rank">{i+1}</div>
                <div>
                  <div style={{fontWeight:700}}>{a.first_name} {a.last_name}</div>
                  <div className="meta">Films in inventory: {a.films}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
