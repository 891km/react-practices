import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

function App() {
  return (
    <>
      <Stopwatch />
    </>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [lapDatas, setLapDatas] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const startTime = useRef(0);
  const intervalID = useRef(null);

  useEffect(() => {
    setIsActive(false);
  }, []);

  function handleStart() {
    setIsActive(true);
    startTime.current = Date.now() - time;
    intervalID.current = setInterval(() => {
      setTime(Date.now() - startTime.current);
    }, 10);
  }

  function handleStop() {
    setIsActive(false);
    clearInterval(intervalID.current);
  }

  function handleLap() {
    const newLapData = { id: Date.now(), time };
    setLapDatas([...lapDatas, newLapData]);
  }

  function handleReset() {
    handleStop();
    setTime(0);
  }

  return (
    <SectionMain>
      <TimeDisplay time={time} />
      <Buttons
        isActive={isActive}
        handleStart={handleStart}
        handleStop={handleStop}
        handleReset={handleReset}
        handleLap={handleLap}
      />
      <LapList lapDatas={lapDatas} />
    </SectionMain>
  );
}

// Components
function TimeDisplay({ time }) {
  return <SpanTime>{formatTime(time)}</SpanTime>;
}

function Buttons({
  isActive,
  handleStart,
  handleStop,
  handleReset,
  handleLap,
}) {
  if (isActive) {
    return (
      <ButtonContainer>
        <button onClick={handleLap} className="btn__lap">
          랩
        </button>
        <button onClick={handleStop} className="btn__stop">
          정지
        </button>
      </ButtonContainer>
    );
  } else {
    return (
      <ButtonContainer>
        <button onClick={handleReset} className="btn__reset">
          재설정
        </button>
        <button onClick={handleStart} className="btn__start">
          시작
        </button>
      </ButtonContainer>
    );
  }
}

function LapList({ lapDatas }) {
  return (
    <ListLap>
      {lapDatas.map((lapData, index) => (
        <li key={lapData.id}>
          <span>랩 {index + 1}</span>
          <span>{formatTime(lapData.time)}</span>
        </li>
      ))}
    </ListLap>
  );
}

function formatTime(time) {
  const formatMin = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    roundingMode: "trunc",
    useGrouping: false,
  });

  const formatSec = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });

  let sec = (time / 1000) % 60;
  let min = time / 1000 / 60;
  if (min >= 100) {
    handleLap();
    handleStop();
  }

  return `${formatMin.format(min)}:${formatSec.format(sec)}`;
}

// styled-components
const ButtonContainer = styled.div`
  button {
    width: 64px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: #f4f4f4;

    &:hover {
      filter: brightness(0.9);
    }
  }

  .btn__start {
    background-color: lightgreen;
  }

  .btn__stop {
    background-color: orangered;
  }
`;

const ListLap = styled.ul`
  border-radius: 8px;
  background-color: #f4f4f4;
  width: 50vw;
  padding: 16px;
  display: flex;
  flex-direction: column-reverse;

  li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #e2e2e2;
    background-color: #fcfcfc;
    margin-bottom: 8px;
  }

  li:first-child {
    margin-bottom: 0;
  }
`;

const SectionMain = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const SpanTime = styled.span`
  display: block;
  font-size: 2rem;
`;

export default App;
