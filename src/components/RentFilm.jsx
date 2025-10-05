import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function RentFilm({ filmId, open, onClose }) {
  const [customerId, setCustomerId] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setCustomerId("");
      setErr("");
    }
  }, [open]);

  if (!open) return null;

  async function submit() {
    const cid = Number(customerId);
    if (!Number.isInteger(cid) || cid <= 0) {
      setErr("Invalid customer id");
      return;
    }
    try {
      await api.post(`/films/${filmId}/rent`, { customer_id: cid });
      onClose(true);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to rent");
    }
  }

  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose(false);
  }

  return (
    <div className="backdrop" onClick={onBackdrop}>
      <div className="modal">
        <h3>Rent Film</h3>
        <div className="hr"></div>
        <div style={{ display:"grid", gap:10 }}>
          <label className="meta">
            Customer ID
            <input
              value={customerId}
              onChange={(e)=>setCustomerId(e.target.value)}
              placeholder="e.g. 1"
              style={{ width:"100%", padding:10, borderRadius:10, border:"1px solid #2a3e67", background:"#0b1428", color:"var(--text)" }}
            />
          </label>
          {err && <div className="meta">{err}</div>}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
            <button className="btn" onClick={()=>onClose(false)}>Cancel</button>
            <button className="btn" onClick={submit}>Rent</button>
          </div>
        </div>
      </div>
    </div>
  );
}
