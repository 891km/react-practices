import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  const totalRecord = useRef([]);

  const passedTime = useRef(0);
  const startTime = useRef(0);
  const intervalID = useRef(null);

  const [lapList, setLapList] = useState([]);
  const sumLapList = useRef(0);

  const handleStart = useCallback(() => {
    setIsActive(true);

    startTime.current = Date.now() - passedTime.current;
    intervalID.current = setInterval(() => {
      passedTime.current = Date.now() - startTime.current;
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
      const lap = passedTime.current - sumLapList.current;
      sumLapList.current += lap;
      return [{ id: Date.now(), time: lap }, ...prev];
    });
  }, []);

  const handleReset = useCallback(() => {
    if (passedTime.current > 0) {
      totalRecord.current.push(passedTime.current);
    }

    handleStop();
    passedTime.current = 0;
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
      <section className="sw__section sw__display">
        <h2 className="sr-only">스톱워치</h2>
        <DisplayTime passedTime={passedTime} />
        <ControlButtons
          isActive={isActive}
          handleStartStop={handleStartStop}
          handleLapReset={handleLapReset}
        />
      </section>
      <LapList
        lapList={lapList}
        passedTime={passedTime}
        sumLapList={sumLapList}
      />
      <Dashboard totalRecord={totalRecord} />
    </>
  );
}

function DisplayTime({ passedTime }) {
  const time = renderTime(passedTime);

  useEffect(() => {
    document.title = formatTime(time);
  }, [time]);

  return <span className="sw__time">{formatTime(time)}</span>;
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
  const time = renderTime(passedTime);

  return (
    <section className="sw__section sw__lapList">
      <h3>랩 리스트</h3>
      <ul>
        {time - sumLapList.current !== 0 && (
          <li>
            <span>{lapList.length + 1}</span>
            <span>{formatTime(time - sumLapList.current)}</span>
          </li>
        )}

        {lapList.map((item, index) => (
          <li key={item.id}>
            <span>{lapList.length - index}</span>
            <span>{formatTime(item.time)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function renderTime(passedTime) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrame;

    function update() {
      setTime(passedTime.current);
      animationFrame = requestAnimationFrame(update);
    }

    animationFrame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [passedTime.current]);

  return time;
}

function Dashboard({ totalRecord }) {
  // const averageRecord = totalRecord.current.length
  //   ? totalRecord.current.reduce((acc, cur) => acc + cur, 0) /
  //     totalRecord.current.length
  //   : 0;

  // const averageRecord = useMemo(() => {
  //   if (totalRecord.current.length) {
  //     return (
  //       totalRecord.current.reduce((acc, cur) => acc + cur, 0) /
  //       totalRecord.current.length
  //     );
  //   } else {
  //     totalRecord.current.length;
  //   }
  // }, []);

  const averageRecord = 0;

  const maxRecord = totalRecord.current.length
    ? Math.max(...totalRecord.current)
    : 0;
  return (
    <section className="sw__section sw__dashboard">
      <h3>통계 대시보드</h3>
      <ul>
        <li>
          <span>총 사용 횟수</span>
          <span>{totalRecord.current.length}</span>
        </li>
        <li>
          <span>평균 측정 시간</span>
          <span>{formatTime(averageRecord)}</span>
        </li>
        <li>
          <span>최장 기록</span>
          <span>{formatTime(maxRecord)}</span>
        </li>
      </ul>
    </section>
  );
}

export default App;
