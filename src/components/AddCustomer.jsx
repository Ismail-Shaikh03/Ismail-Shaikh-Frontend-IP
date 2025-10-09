import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AddCustomer({ open, onClose, onCreated }) {
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
  const [cities, setCities] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        district: "",
        city_id: "",
        postal_code: "",
        phone: ""
      });
      setErr("");
      (async () => {
        try {
          const { data } = await api.get("/customers/cities");
          setCities(data);
        } catch {
          setCities([]);
        }
      })();
    }
  }, [open]);

  if (!open) return null;

  function set(k, v) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function submit() {
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim() || null,
      address: form.address.trim(),
      district: form.district.trim(),
      city_id: Number(form.city_id),
      postal_code: form.postal_code.trim() || null,
      phone: form.phone.trim() || "000-000-0000"
    };
    if (!payload.first_name || !payload.last_name || !payload.address || !payload.district || !payload.city_id) {
      setErr("All required fields must be filled.");
      return;
    }
    try {
      const { data } = await api.post("/customers", payload);
      onCreated?.(data);
      onClose(true);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to create customer");
    }
  }

  return (
    <div className="backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(false); }}>
      <div className="modal">
        <h3>Add Customer</h3>
        <div className="hr"></div>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <input value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="First name" style={i} />
            <input value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Last name" style={i} />
          </div>
          <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="Email (optional)" style={i} />
          <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Address" style={i} />
          <input value={form.district} onChange={e => set("district", e.target.value)} placeholder="District/State" style={i} />
          <select value={form.city_id} onChange={e => set("city_id", e.target.value)} style={i}>
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c.city_id} value={c.city_id}>{c.city}</option>
            ))}
          </select>
          <input value={form.postal_code} onChange={e => set("postal_code", e.target.value)} placeholder="Postal Code (optional)" style={i} />
          <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Phone" style={i} />
          {err && <div className="meta">{err}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn" onClick={() => onClose(false)}>Cancel</button>
            <button className="btn" onClick={submit}>Create</button>
          </div>
        </div>
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


