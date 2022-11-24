import React from "react";
import styled from "styled-components";

const size = 40;

const CircleWrapper = styled.div`
  position: relative;
  width: ${size}px;
  height: ${size}px;
`;

const BackCircle = styled.div`
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: 8px solid ${(props) => props.theme.primaryPurple100};
  background: ${(props) => props.theme.neutral};
`;

const InnerCircleWrapper = styled.div`
  position: absolute;
  width: ${size}px;
  height: ${size}px;
`;

const InnerCircle = styled.div`
  position: absolute;
  width: ${size - 2}px;
  height: ${size - 2}px;
  left: 1px;
  top: 1px;
  background: ${(props) => props.theme.neutral};
  border-radius: 50%;
  border: 6px solid ${(props) => props.theme.primaryPurple500};
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
  font-size: 10px;
  font-weight: 700;
  color: ${(props) => props.theme.textPrimary};
`;

const CountDown = ({ percent = 0 }) => {
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
    <CircleWrapper>
      <BackCircle />
      <InnerCircleWrapper>
        <InnerCircleLeft turn={turn} overHalf={overHalf} />
        <InnerCircleMaskLeft overHalf={overHalf} />
        <InnerCircleMaskRight overHalf={overHalf} />
        <InnerCircleRight overHalf={overHalf} />
      </InnerCircleWrapper>
      <PercentLable>{`${percentInt}%`}</PercentLable>
    </CircleWrapper>
  );
};

export default CountDown;
