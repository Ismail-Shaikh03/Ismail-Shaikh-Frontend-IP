export default function Details({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4, 8, 20, 0.85)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0A1426",
          color: "#E9F2FF",
          width: "min(700px, 92vw)",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

