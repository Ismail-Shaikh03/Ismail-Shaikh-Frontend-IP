import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api/api";

export default function FilmPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const ctrl = useRef(null);

  const trimmed = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (ctrl.current) ctrl.current.abort();
      ctrl.current = new AbortController();
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get(`/films/search`, {
          params: trimmed ? { q: trimmed } : {},
          signal: ctrl.current.signal
        });
        setRows(data);
      } catch (e) {
        if (!ctrl.current.signal.aborted) setErr(e?.response?.data?.error || e?.message || "Failed to search.");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [trimmed]);

  return (
    <div className="wrap">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2>Search Films</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by film title, actor name, or genre"
          style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 10, border: "1px solid #ccc", marginBottom: 16 }}
        />
        {loading && <div className="meta">Searching…</div>}
        {err && <div className="meta">{err}</div>}
        {!loading && rows.length === 0 && <div className="meta">No results</div>}
        <ul className="list" style={{ marginTop: 12 }}>
          {rows.map(f => (
            <li key={f.film_id} className="card" style={{ alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{f.title}</div>
                <div className="meta">Year: {f.release_year} • Rating: {f.rating} • {f.length} min • ${Number(f.rental_rate).toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

