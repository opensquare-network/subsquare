import { useMemo } from "react";
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
  background-color: ${(p) => p.fg};
  width: ${(p) => p.percentage}%;
`;
const PercentageWrapper = styled(Bar)`
  left: ${(p) => p.start || 0}%;
  width: ${(p) => (p.end >= 100 ? p.end - p.start : p.end)}%;
  background-color: ${(p) => p.bg};
`;

export default function Progress({
  percentage = 0,
  start = 0,
  end = 100,
  fg,
  bg,

  progressItems = [],
}) {
  const items = useMemo(() => {
    const p = progressItems;

    if (!p.length) {
      p.push({
        percentage,
        fg,
        bg,
        start,
        end,
      });
    }

    return p;
  }, [progressItems]);

  return (
    <Wrapper>
      <Background />
      {items.map((item, idx) => (
        <PercentageWrapper
          key={idx}
          bg={item.bg}
          start={Number(item.start) || 0}
          end={Math.abs(Number(item.end) || 100)}
        >
          <Percentage fg={item.fg} percentage={item.percentage} />
        </PercentageWrapper>
      ))}
    </Wrapper>
  );
}
