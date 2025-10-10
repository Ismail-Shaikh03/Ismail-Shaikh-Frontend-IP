import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

export default function EditCustomer({ open, customer, onClose, onUpdated }) {
  const [cities, setCities] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    district: "",
    city_id: "",
    postal_code: "",
    phone: ""
  });

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const { data } = await api.get("/customers/cities");
        setCities(data || []);
      } catch {
        setCities([]);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open || !customer) return;
    setForm({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      address: customer.address || "",
      district: customer.district || "",
      city_id: "",
      postal_code: customer.postal_code || "",
      phone: customer.phone || ""
    });
  }, [open, customer]);

  const resolvedCityId = useMemo(() => {
    if (form.city_id) return form.city_id;
    const match = cities.find(c => c.city?.toLowerCase() === (customer?.city || "").toLowerCase());
    return match ? String(match.city_id) : "";
  }, [form.city_id, cities, customer]);

  if (!open) return null;

  function setField(k, v) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function onSave(e) {
    e.preventDefault();
    setErr("");
    try {
      setBusy(true);
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim() || null,
        address: form.address.trim(),
        district: form.district.trim(),
        city_id: resolvedCityId ? Number(resolvedCityId) : null,
        postal_code: form.postal_code.trim() || null,
        phone: form.phone.trim() || "000-000-0000"
      };
      if (!payload.first_name || !payload.last_name || !payload.address || !payload.district || !payload.city_id) {
        setErr("All required fields must be filled.");
        setBusy(false);
        return;
      }
      const { data } = await api.put(`/customers/${customer.customer_id}`, payload);
      onUpdated?.(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to update customer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="backdrop" onClick={(e)=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <h3>Edit Customer</h3>
        <div className="hr"></div>
        {err && <div className="meta" style={{ color: "#ff6969" }}>{err}</div>}
        <form onSubmit={onSave} style={{ display:"grid", gap:10 }}>
          <div style={{ display:"grid", gap:10, gridTemplateColumns:"1fr 1fr" }}>
            <input value={form.first_name} onChange={e=>setField("first_name", e.target.value)} placeholder="First name" style={i} />
            <input value={form.last_name} onChange={e=>setField("last_name", e.target.value)} placeholder="Last name" style={i} />
          </div>
          <input value={form.email} onChange={e=>setField("email", e.target.value)} placeholder="Email" style={i} />
          <input value={form.address} onChange={e=>setField("address", e.target.value)} placeholder="Address" style={i} />
          <input value={form.district} onChange={e=>setField("district", e.target.value)} placeholder="State" style={i} />
          <select value={resolvedCityId} onChange={e=>setField("city_id", e.target.value)} style={i}>
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c.city_id} value={c.city_id}>{c.city}</option>
            ))}
          </select>
          <input value={form.postal_code} onChange={e=>setField("postal_code", e.target.value)} placeholder="Postal Code" style={i} />
          <input value={form.phone} onChange={e=>setField("phone", e.target.value)} placeholder="Phone" style={i} />
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button className="btn" type="button" onClick={onClose}>Cancel</button>
            <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const i = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #2a3e67",
  background: "#0b1428",
  color: "var(--text)"
};


