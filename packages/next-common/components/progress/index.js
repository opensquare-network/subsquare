import { useMemo } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  height: 8px;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
`;

const Background = styled(Bar)`
  background-color: ${(p) => p.theme.grey100Bg};
  overflow: hidden;
`;

const Percentage = styled(Bar)`
  background-color: ${(p) => p.color ?? p.theme.secondaryBlue500};
  width: ${(p) => p.percentage}%;
  left: ${(p) => p.offsetLeft}%;
  right: ${(p) => p.offsetRight}%;
`;
const Total = styled(Bar)`
  opacity: 0.1;
  background-color: ${(p) => p.color ?? p.theme.secondaryBlue500};
  left: ${(p) => p.offsetLeft}%;
  right: ${(p) => p.offsetRight}%;
`;

export default function Progress({
  percentage = 0,
  offsetLeft = 0,
  offsetRight = 0,
  color,
}) {
  const calcPercentage = useMemo(() => {
    let v = percentage;

    if (offsetLeft || offsetRight) {
      const offset = offsetLeft + offsetRight;
      v = ((100 - offset) / 100) * percentage;
    }

    return v;
  }, [offsetLeft, offsetRight, percentage]);

  return (
    <Wrapper>
      <Background />
      <Total color={color} offsetLeft={offsetLeft} offsetRight={offsetRight} />
      <Percentage
        color={color}
        percentage={calcPercentage}
        offsetLeft={offsetLeft}
        offsetRight={offsetRight}
      />
    </Wrapper>
  );
}
