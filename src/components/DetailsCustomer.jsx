import { useEffect, useState } from "react";
import { api } from "../api/api";
import EditCustomer from "./EditCustomer";

export default function DetailsCustomer({ customerId, open, onClose, onDeleted, onNotify }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (!open || !customerId) return;
    setData(null);
    setErr("");
    (async () => {
      try {
        const { data } = await api.get(`/customers/${customerId}`);
        if (!ignore) setData(data);
      } catch (e) {
        if (!ignore) setErr(e?.response?.data?.error || "Failed to load");
      }
    })();
    return () => { ignore = true; };
  }, [open, customerId]);

  if (!open) return null;

  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  async function onDelete() {
    const ok = window.confirm("Delete this customer?");
    if (!ok) return;
    try {
      setBusy(true);
      const { data: result } = await api.delete(`/customers/${customerId}`);
      if (result.blocked) {
        onNotify?.(result.message || "Cannot delete", false);
        return;
      }
      if (result.deleted) {
        onNotify?.(result.message || "Deleted", true);
        onDeleted?.(customerId, result);
        onClose();
      }
    } catch (e) {
      onNotify?.(e?.response?.data?.error || "Failed to delete", false);
    } finally {
      setBusy(false);
    }
  }

  async function onReturn(rentalId) {
    try {
      const { data: result } = await api.post(`/returns/${rentalId}`);
      if (result.returned) {
        const { data: refreshed } = await api.get(`/customers/${customerId}`);
        setData(refreshed);
        onNotify?.(result.message || "Rental marked as returned.", true);
      } else if (result.alreadyReturned) {
        onNotify?.(result.message || "Rental already returned.", false);
      }
    } catch (e) {
      onNotify?.(e?.response?.data?.error || "Failed to mark returned", false);
    }
  }

  return (
    <div className="backdrop" onClick={onBackdrop}>
      <div className="modal" style={{ position: "relative", maxHeight: "80vh", overflowY: "auto", width: "min(900px, 92vw)" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", right: 10, top: 10, background: "transparent", border: "none", fontSize: 20, color: "#fff", cursor: "pointer", fontWeight: "bold" }}
        >
          ×
        </button>

        <h3>Customer Details</h3>
        <div className="hr"></div>
        {err && <div className="meta">{err}</div>}
        {!data ? (
          <div className="meta">Loading…</div>
        ) : (
          <div style={{ display: "grid", gap: 16, paddingRight: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                {data.customer.first_name} {data.customer.last_name}
              </div>

              <div className="header-grid">
                <div className="field">
                  <div className="label">Customer ID</div>
                  <div className="value">{data.customer.customer_id}</div>
                </div>
                <div className="field">
                  <div className="label">Active</div>
                  <div className="value">{data.customer.active ? "Yes" : "No"}</div>
                </div>

                <div className="field">
                  <div className="label">Email</div>
                  <div className="value">{data.customer.email || "—"}</div>
                </div>
                <div className="field">
                  <div className="label">Phone</div>
                  <div className="value">{data.customer.phone || "—"}</div>
                </div>

                <div className="field">
                  <div className="label">Created</div>
                  <div className="value">{new Date(data.customer.create_date).toLocaleDateString()}</div>
                </div>
                <div className="field">
                  <div className="label">City</div>
                  <div className="value">{data.customer.city}, {data.customer.country}</div>
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <div className="label">Address</div>
                  <div className="value">
                    {data.customer.address}
                    {data.customer.address2 ? `, ${data.customer.address2}` : ""}
                    , {data.customer.district}
                    {data.customer.postal_code ? ` ${data.customer.postal_code}` : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="hr"></div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Active Rentals</div>
              {data.activeRentals.length === 0 ? (
                <div className="meta">None</div>
              ) : (
                <ul className="list">
                  {data.activeRentals.map(r => (
                    <li key={r.rental_id} className="card row">
                      <div className="row-main">
                        <div className="row-title">{r.title}</div>
                        <div className="meta">Rental #{r.rental_id} • Inventory #{r.inventory_id} • Rented: {new Date(r.rental_date).toLocaleString()}</div>
                      </div>
                      <div className="btn-group">
                        <button className="btn" onClick={() => onReturn(r.rental_id)}>Return</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700, margin: "6px 0 8px" }}>Rental History</div>
              {data.rentalHistory.length === 0 ? (
                <div className="meta">None</div>
              ) : (
                <ul className="list">
                  {data.rentalHistory.map(r => (
                    <li key={r.rental_id} className="card row">
                      <div className="row-main">
                        <div className="row-title">{r.title}</div>
                        <div className="meta">Rental #{r.rental_id} • Inventory #{r.inventory_id} • Out: {new Date(r.rental_date).toLocaleString()} • Returned: {new Date(r.return_date).toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button className="btn" onClick={() => setEditOpen(true)}>Edit</button>
              <button className="btn" onClick={onDelete} disabled={busy}>Delete</button>
              <button className="btn" onClick={onClose}>Close</button>
            </div>

            <EditCustomer
              open={editOpen}
              customer={{
                customer_id: data.customer.customer_id,
                first_name: data.customer.first_name,
                last_name: data.customer.last_name,
                email: data.customer.email,
                address: data.customer.address,
                district: data.customer.district,
                city: data.customer.city,
                postal_code: data.customer.postal_code,
                phone: data.customer.phone
              }}
              onClose={() => setEditOpen(false)}
              onUpdated={async () => {
                setEditOpen(false);
                try {
                  const { data: refreshed } = await api.get(`/customers/${customerId}`);
                  setData(refreshed);
                  onNotify?.("Customer updated successfully.", true);
                } catch {
                  onNotify?.("Updated, but failed to refresh details.", false);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}












