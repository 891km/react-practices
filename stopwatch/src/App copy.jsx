import { useState, useRef, useEffect, useCallback } from "react";
import "./App.style.css";

function App() {
  return (
    <>
      <StopWatch />
    </>
  );
}

function formatTime(time) {
  const secTime = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((time / 1000) % 60);

  const minTime = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    maximumFractionDigits: 0,
    roundingMode: "trunc",
  }).format(time / 1000 / 60);
  return `${minTime}:${secTime}`;
}

function StopWatch() {
  const [isActive, setIsActive] = useState(false);

  const [passedTime, setPassedTime] = useState(0);
  const startTime = useRef(0);
  const intervalID = useRef(null);

  const [lapList, setLapList] = useState([]);
  const sumLapList = useRef(0);

  const handleStart = useCallback(() => {
    setIsActive(true);

    startTime.current = Date.now() - passedTime;
    intervalID.current = setInterval(() => {
      setPassedTime(Date.now() - startTime.current);
    }, 10);
  }, [passedTime]);

  const handleStop = useCallback(() => {
    setIsActive(false);

    clearInterval(intervalID.current);
  }, []);

  const handleStartStop = useCallback(() => {
    if (isActive) {
      handleStop();
    } else {
      handleStart();
    }
  }, [isActive, handleStop, handleStart]);

  const handleLap = useCallback(() => {
    setLapList((prev) => {
      const lap = passedTime - sumLapList.current;
      sumLapList.current += lap;
      return [{ id: Date.now(), time: lap }, ...prev];
    });
  }, []);

  const handleReset = useCallback(() => {
    handleStop();
    setPassedTime(0);
    setLapList([]);
    sumLapList.current = 0;
  }, [handleStop]);

  const handleLapReset = useCallback(() => {
    if (isActive) {
      handleLap();
    } else {
      handleReset();
    }
  }, [isActive, handleLap, handleReset]);

  return (
    <>
      <div className="sw__display">
        <DisplayTime passedTime={passedTime} />
        <ControlButtons
          isActive={isActive}
          handleStartStop={handleStartStop}
          handleLapReset={handleLapReset}
        />
      </div>
      <LapList
        lapList={lapList}
        passedTime={passedTime}
        sumLapList={sumLapList}
      />
    </>
  );
}

function DisplayTime({ passedTime }) {
  useEffect(() => {
    document.title = formatTime(passedTime);
  }, [passedTime]);

  return <span className="sw__time">{formatTime(passedTime)}</span>;
}

function ControlButtons({ isActive, handleStartStop, handleLapReset }) {
  const btnStartStop = useRef(null);
  const btnLapReset = useRef(null);

  useEffect(() => {
    if (isActive) {
      btnStartStop.current.innerText = "정지";
      btnLapReset.current.innerText = "랩";
    } else {
      btnStartStop.current.innerText = "시작";
      btnLapReset.current.innerText = "재설정";
    }
  }, [isActive]);

  useEffect(() => {
    function handleKeyBoard(e) {
      if (e.code === "Space") {
        e.preventDefault();
        btnStartStop.current.focus();
        handleStartStop();
      }
      if (e.code === "KeyR") {
        e.preventDefault();
        btnLapReset.current.focus();
        handleLapReset();
      }
    }
    window.addEventListener("keydown", handleKeyBoard);

    return () => {
      window.removeEventListener("keydown", handleKeyBoard);
    };
  }, [handleStartStop, handleLapReset]);

  return (
    <div className="sw__btns">
      <button
        className="sw__btn sw__btn--startStop"
        ref={btnStartStop}
        onClick={handleStartStop}
      >
        시작
      </button>
      <button
        className="sw__btn sw__btn--lapReset"
        ref={btnLapReset}
        onClick={handleLapReset}
      >
        랩
      </button>
    </div>
  );
}

function LapList({ lapList, passedTime, sumLapList }) {
  return (
    <div className="sw__lapList">
      <h3>랩 리스트</h3>
      <ul>
        {passedTime - sumLapList.current !== 0 && (
          <li>
            <span>{lapList.length + 1}</span>
            <span>{formatTime(passedTime - sumLapList.current)}</span>
          </li>
        )}

        {lapList.map((item, index) => (
          <li key={item.id}>
            <span>{lapList.length - index}</span>
            <span>{formatTime(item.time)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
