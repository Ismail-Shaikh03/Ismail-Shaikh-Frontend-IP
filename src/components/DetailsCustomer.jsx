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
      <div className="modal" style={{ position: "relative", maxHeight: "80vh", overflowY: "auto" }}>
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
          <div style={{ display: "grid", gap: 14, paddingRight: 10 }}>
            <div>
              <div style={{ fontWeight: 800 }}>{data.customer.first_name} {data.customer.last_name}</div>
              <div className="meta">ID: {data.customer.customer_id} • {data.customer.email || "no-email"} • Active: {data.customer.active ? "Yes" : "No"}</div>
              <div className="meta">
                {data.customer.address}{data.customer.address2 ? `, ${data.customer.address2}` : ""}, {data.customer.district} {data.customer.postal_code || ""}, {data.customer.city}, {data.customer.country}
              </div>
              <div className="meta">Phone: {data.customer.phone}</div>
              <div className="meta">Created: {new Date(data.customer.create_date).toLocaleDateString()}</div>
            </div>

            <div className="hr"></div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Active Rentals</div>
              {data.activeRentals.length === 0 ? (
                <div className="meta">None</div>
              ) : (
                <ul className="list">
                  {data.activeRentals.map(r => (
                    <li key={r.rental_id} className="card" style={{ alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{r.title}</div>
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
              <div style={{ fontWeight: 700, margin: "10px 0 6px" }}>Rental History</div>
              {data.rentalHistory.length === 0 ? (
                <div className="meta">None</div>
              ) : (
                <ul className="list">
                  {data.rentalHistory.map(r => (
                    <li key={r.rental_id} className="card" style={{ alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{r.title}</div>
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










