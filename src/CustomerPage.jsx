import { useEffect, useMemo, useState } from "react";
import { api } from "./api/api";

export default function CustomerPage() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get("/customers", { params: { page, pageSize } });
        if (!ignore) {
          setRows(data.rows || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.error || "Failed to load customers.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [page, pageSize]);

  return (
    <div className="wrap">
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2>Customers</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div className="meta">Total: {total}</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              style={{ border: "1px solid #fff", background: "transparent", color: "#fff", padding: "6px 10px", borderRadius: 8 }}
            >
              Prev
            </button>
            <div className="meta">Page {page} / {totalPages}</div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              style={{ border: "1px solid #fff", background: "transparent", color: "#fff", padding: "6px 10px", borderRadius: 8 }}
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
                <div className="meta">{c.email || "no-email"} • Active: {c.active ? "Yes" : "No"} • Created: {new Date(c.create_date).toLocaleDateString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


