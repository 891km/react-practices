import { useState, useRef, useEffect, useCallback, useMemo } from "react";

function StopWatch({ isActive, setIsActive, curKey }) {
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

  const handleLap = useCallback(() => {
    const lap = passedTime.current - sumLapList.current;
    sumLapList.current += lap;

    setLapList((prev) => {
      return [{ id: Date.now(), lap: lap, time: passedTime.current }, ...prev];
    });
  }, []);

  const handleReset = useCallback(() => {
    handleStop();

    setLapList([]);
    passedTime.current = 0;
    sumLapList.current = 0;
    totalRecord.current = [];
  }, [handleStop]);

  const handleStartStop = useCallback(() => {
    if (isActive) {
      handleStop();
    } else {
      handleStart();
    }
  }, [isActive, handleStop, handleStart]);

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
          curKey={curKey}
        />
      </section>
      <LapList
        lapList={lapList}
        passedTime={passedTime}
        sumLapList={sumLapList}
      />
      <Dashboard lapList={lapList} />
    </>
  );
}

// Components
function DisplayTime({ passedTime }) {
  const time = renderTime(passedTime);

  useEffect(() => {
    document.title = formatTime(time);
  }, [time]);

  return <span className="sw__time">{formatTime(time)}</span>;
}

function ControlButtons({ isActive, handleStartStop, handleLapReset, curKey }) {
  const btnStartStop = useRef(null);
  const btnLapReset = useRef(null);

  useEffect(() => {
    const btnStartStopText =
      btnStartStop.current.querySelector(".sw__btn__text");
    const btnLapResetText = btnLapReset.current.querySelector(".sw__btn__text");

    if (isActive) {
      btnStartStopText.innerText = "정지";
      btnLapResetText.innerText = "랩";
    } else {
      btnStartStopText.innerText = "시작";
      btnLapResetText.innerText = "재설정";
    }
  }, [isActive]);

  useEffect(() => {
    if (curKey === "Space") {
      //   btnStartStop.current.focus();
      handleStartStop();
    }
    if (curKey === "KeyR") {
      //   btnLapReset.current.focus();
      handleLapReset();
    }
  }, [curKey]);

  return (
    <div className="sw__btns">
      <button
        className="sw__btn sw__btn--startStop"
        ref={btnStartStop}
        onClick={handleStartStop}
      >
        <span className="sw__btn__text">시작</span>
        <kbd>SpaceBar</kbd>
      </button>
      <button
        className="sw__btn sw__btn--lapReset"
        ref={btnLapReset}
        onClick={handleLapReset}
      >
        <span className="sw__btn__text">랩</span>
        <kbd>R</kbd>
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
            <span>lap {lapList.length + 1}</span>
            <span>{formatTime(time - sumLapList.current)}</span>
            <span>{formatTime(passedTime.current)}</span>
          </li>
        )}

        {lapList.map((item, index) => (
          <li key={item.id}>
            <span className="lapIndex">lap {lapList.length - index}</span>
            <span>{formatTime(item.lap)}</span>
            <span>{formatTime(item.time)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Dashboard({ lapList }) {
  const averageLap = lapList.length
    ? lapList.reduce((acc, cur) => acc + cur.lap, 0) / lapList.length
    : 0;

  const wholeLap = lapList.map((item) => item.lap);
  const minLap = lapList.length ? Math.min(...wholeLap) : 0;
  const maxLap = lapList.length ? Math.max(...wholeLap) : 0;
  return (
    <section className="sw__section sw__dashboard">
      <h3>통계 대시보드</h3>
      <ul>
        <li>
          <span>평균 측정 시간</span>
          <span>{formatTime(averageLap)}</span>
        </li>
        <li>
          <span>최단 기록</span>
          <span>{formatTime(minLap)}</span>
        </li>
        <li>
          <span>최장 기록</span>
          <span>{formatTime(maxLap)}</span>
        </li>
      </ul>
    </section>
  );
}

// function
function renderTime(passedTime) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrame;

    function update() {
      setTime(passedTime.current);
      animationFrame = requestAnimationFrame(update);
    }

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [passedTime]);

  return time;
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

export default StopWatch;
