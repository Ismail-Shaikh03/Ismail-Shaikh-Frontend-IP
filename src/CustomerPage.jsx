import { useEffect, useMemo, useState } from "react";
import { api } from "./api/api";

export default function CustomerPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const trimmed = useMemo(() => q.trim(), [q]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => { setPage(1); }, [trimmed]);

  useEffect(() => {
    let ignore = false;
    const t = setTimeout(async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get("/customers", { params: { q: trimmed, page } });
        if (!ignore) {
          setRows(data.rows || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.error || "Failed to load customers.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 300);
    return () => { ignore = true; clearTimeout(t); };
  }, [trimmed, page]);

  return (
    <div className="wrap">
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2>Customers</h2>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by customer ID, first or last name"
          style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 10, border: "1px solid #ccc", marginBottom: 12 }}
        />

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div className="meta">Total: {total}</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              className="btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Prev
            </button>
            <div className="meta">Page {page} / {totalPages}</div>
            <button
              className="btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>

        {err && <div className="meta">{err}</div>}
        {loading && <div className="meta">Loading…</div>}

        <ul className="list" style={{ marginTop: 12 }}>
          {rows.map(c => (
            <li key={c.customer_id} className="card" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.first_name} {c.last_name}</div>
                <div className="meta">
                  ID: {c.customer_id} • {c.email || "no-email"} • Active: {c.active ? "Yes" : "No"} • Created: {new Date(c.create_date).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


