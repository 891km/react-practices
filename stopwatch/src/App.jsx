import StopWatch from "./Components/Stopwatch.jsx";
import CanvasThree from "./Components/CanvasThree.jsx";
import "./App.style.css";
import { useEffect, useState } from "react";

function App() {
  const [curKey, setCurKey] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        setCurKey(e.code);
      }
      if (e.code === "KeyR") {
        setCurKey(e.code);
      }
    };
    const handleKeyUp = () => setCurKey(null);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <CanvasThree isActive={isActive} />
      <StopWatch
        isActive={isActive}
        setIsActive={setIsActive}
        curKey={curKey}
      />
    </>
  );
}

export default App;
