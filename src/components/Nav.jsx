import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="navbar">
      <Link to="/" style={{ marginRight: 20, color: "#fff" }}>Home</Link>
      <Link to="/films" style={{ marginRight: 20, color: "#fff" }}>Films</Link>
    </div>
  );
}
