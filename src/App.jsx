import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Top5Film from "./components/Top5Film";
import Top5Actors from "./components/Top5Actors";
import FilmPage from "./FilmPage";
import CustomerPage from "./CustomerPage"
import Nav from "./components/Nav";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <div className="wrap">
              <div className="main">
                <Top5Film />
                <Top5Actors />
              </div>
            </div>
          }
        />
        <Route path="/films" element={<FilmPage />} />
        <Route path="/customers" element={<CustomerPage />} />
      </Routes>
    </Router>
  );
}



