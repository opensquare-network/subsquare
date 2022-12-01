import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  overflow: hidden;
`;

const Background = styled(Bar)`
  background-color: ${(p) => p.theme.grey100Bg};
`;

const Percentage = styled(Bar)`
  background-color: ${(p) => p.fg ?? p.theme.secondaryBlue500};
  width: ${(p) => p.percentage}%;
`;
const Total = styled(Bar)`
  background-color: ${(p) => p.bg ?? p.theme.secondaryBlue100};
  width: ${(p) => 100 - p.offsetLeft - p.offsetRight}%;
  left: ${(p) => p.offsetLeft}%;
  right: ${(p) => p.offsetRight}%;
  overflow: hidden;
`;

export default function Progress({
  percentage = 0,
  offsetLeft = 0,
  offsetRight = 0,
  fg,
  bg,
}) {
  return (
    <Wrapper>
      <Background />
      <Total bg={bg} offsetLeft={offsetLeft} offsetRight={offsetRight}>
        <Percentage
          fg={fg}
          percentage={percentage}
          offsetLeft={offsetLeft}
          offsetRight={offsetRight}
        />
      </Total>
    </Wrapper>
  );
}
