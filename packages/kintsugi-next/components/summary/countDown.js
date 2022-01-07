import React from "react";
import styled from "styled-components";

const CircleWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
`;

const BackCircle = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 8px solid #f5f2ff;
  background: white;
`;

const InnerCircleWrapper = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
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
