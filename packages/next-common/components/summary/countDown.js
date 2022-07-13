import React from "react";
import styled, { css } from "styled-components";
import useDarkMode from "../../utils/hooks/useDarkMode";

const CircleWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
    `};
`;

const BackCircle = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 8px solid #f5f2ff;
  background: white;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
    `};
`;

const InnerCircleWrapper = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  background: #212433;
`;

const InnerCircle = styled.div`
  position: absolute;
  width: 46px;
  height: 46px;
  left: 1px;
  top: 1px;
  background: white;
  border-radius: 50%;
  border: 6px solid #6848ff;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
    `};
`;

const InnerCircleLeft = styled(InnerCircle)`
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  transform: rotate(${(p) => p.turn}turn);
`;
const InnerCircleRight = styled(InnerCircle)`
  clip-path: polygon(50% 0px, 101% 0px, 101% 100%, 50% 100%);
  visibility: ${(p) => (p.overHalf ? "visible" : "hidden")};
`;

const InnerCircleMaskLeft = styled(BackCircle)`
  clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0 100%);
  visibility: ${(p) => (p.overHalf ? "hidden" : "visible")};
`;

const InnerCircleMaskRight = styled(BackCircle)`
  clip-path: polygon(52% 0px, 100% 0px, 100% 100%, 52% 100%);
  visibility: ${(p) => (p.overHalf ? "visible" : "hidden")};
`;

const PercentLable = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.9);
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: white;
    `};
`;

const CountDown = ({ percent = 0 }) => {
  const [theme] = useDarkMode();
  let percentInt = parseInt(percent);
  if (isNaN(percentInt) || percentInt < 0) {
    percentInt = 0;
  }
  let turn = percentInt / 100;
  if (percentInt > 100) {
    turn = 1;
  }
  const overHalf = percentInt > 50;
  return (
    <CircleWrapper theme={theme}>
      <BackCircle theme={theme} />
      <InnerCircleWrapper theme={theme}>
        <InnerCircleLeft theme={theme} turn={turn} overHalf={overHalf} />
        <InnerCircleMaskLeft theme={theme} overHalf={overHalf} />
        <InnerCircleMaskRight theme={theme} overHalf={overHalf} />
        <InnerCircleRight theme={theme} overHalf={overHalf} />
      </InnerCircleWrapper>
      <PercentLable theme={theme}>{`${percentInt}%`}</PercentLable>
    </CircleWrapper>
  );
};

export default CountDown;
