import React from "react";
import styled from "styled-components";
import CountDownOrigin from "../_CountDown";

const size = 40;

const CircleWrapper = styled.div`
  position: relative;
  width: ${size}px;
  height: ${size}px;
`;

const PercentLable = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  font-size: 10px;
  font-weight: 700;
  color: var(--textPrimary);
`;

const CountDown = ({ percent = 0 }) => {
  let percentInt = parseInt(percent);
  if (isNaN(percentInt) || percentInt < 0) {
    percentInt = 0;
  }

  return (
    <CircleWrapper>
      <CountDownOrigin
        size={40}
        width={6}
        numerator={percent ?? 0}
        denominator={100}
        backgroundColor="var(--theme100)"
        foregroundColor="var(--theme500)"
      />
      <PercentLable>{`${percentInt}%`}</PercentLable>
    </CircleWrapper>
  );
};

export default CountDown;
