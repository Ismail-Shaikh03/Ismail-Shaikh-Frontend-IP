import Top5Film from "./components/Top5Film";
import Top5Actors from "./components/Top5Actors";
import "./index.css";

export default function App(){
  return (
    <>
      <div className="navbar">NAV BAR</div>
      <div className="wrap">
        <div className="main">
          <Top5Film />
          <Top5Actors />
        </div>
      </div>
    </>
  );
}



