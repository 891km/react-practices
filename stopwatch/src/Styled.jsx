import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        font-size: 10px;
    }

    body {
        font-size: 1.6rem;
        width: 100vw;
        height: 100vh;
    }

    #root {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
`;

export const SectionMain = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  width: 320px;
  height: 100%;
  overflow-y: hidden;
`;

export const SpanTime = styled.span`
  font-family: monospace;
  font-size: 60px;

  flex: 0 0 60%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 1.6rem;

  button {
    width: 7rem;
    aspect-ratio: 1;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: #dedede;

    &:hover {
      filter: brightness(0.9);
    }
  }

  .btn__start {
    color: #003d00;
    background-color: lightgreen;
  }

  .btn__stop {
    color: #640000;
    background-color: orangered;
  }
`;

export const ListLap = styled.ul`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-top: 1px solid #dedede;

  li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    padding: 14px 8px;
    position: relative;
    border-bottom: 1px solid #dedede;
  }

  li:nth-last-child(1) {
    margin-bottom: 0;
    color: orangered;
  }

  li:nth-last-child(2) {
    color: green;
  }
`;
