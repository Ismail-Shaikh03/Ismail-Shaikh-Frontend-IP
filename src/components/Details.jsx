export default function Details({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", display:"grid", placeItems:"center", zIndex:1000 }}
      onClick={onClose}
    >
      <div
        style={{ background:"#fff", color:"#000", width:"min(700px, 92vw)", borderRadius:12, padding:20, boxShadow:"0 10px 30px rgba(0,0,0,.3)" }}
        onClick={(e)=>e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
