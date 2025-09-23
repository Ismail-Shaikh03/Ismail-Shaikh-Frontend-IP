import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import DetailsActor from "./DetailsActor.jsx";
import DetailsFilm from "./DetailsFilm.jsx";

export default function Top5Actors() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  const [openActorId, setOpenActorId] = useState(null);
  const [openFilmId, setOpenFilmId] = useState(null);

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
                  <button
                    onClick={()=>setOpenActorId(a.actor_id)}
                    style={{ all:"unset", cursor:"pointer", fontWeight:700, color:"#fff" }}
                  >
                    {a.first_name} {a.last_name}
                  </button>
                  <div className="meta">Films in inventory: {a.films}</div>
                </div>
              </div>
              <button
                style={{
                  background:"transparent", color:"#fff", border:"1px solid #fff",
                  borderRadius:8, padding:"6px 10px", cursor:"pointer"
                }}
                onClick={()=>setOpenActorId(a.actor_id)}
              >
                Details
              </button>
            </li>
          ))}
        </ul>
      )}
      <DetailsActor
        actorId={openActorId}
        open={!!openActorId}
        onClose={()=>setOpenActorId(null)}
        onOpenFilm={(id)=>{ setOpenActorId(null); setOpenFilmId(id); }}
      />
      <DetailsFilm filmId={openFilmId} open={!!openFilmId} onClose={()=>setOpenFilmId(null)} />
    </section>
  );
}

