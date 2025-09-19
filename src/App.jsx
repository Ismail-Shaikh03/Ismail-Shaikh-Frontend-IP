import Top5Film from "./components/Top5Film";
import "./index.css";

export default function App(){
  return (
    <>
      <div className="navbar">NAV BAR</div>
      <div className="wrap">
        <div className="main">
          <Top5Film />
        </div>
      </div>
    </>
  );
}


