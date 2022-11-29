import { useMemo } from "react";
import styled, { css } from "styled-components";
import Tooltip from "../tooltip";

const bar_css = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  height: 8px;
`;

const Bar = styled.div`
  ${bar_css};
`;

const Background = styled(Bar)`
  background-color: ${(p) => p.theme.grey100Bg};
`;

const Percentage = styled(Bar)``;
const PercentageWrapper = styled(Bar)``;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(p) => p.start || 0}%;
  width: ${(p) => (p.end >= 100 ? p.end - p.start : p.end)}%;

  /* tooltip children wrapper */
  > div {
    width: ${(p) => p.percentage}%;
    background-color: ${(p) => p.fg};
    ${bar_css};
  }
`;

export default function Progress({
  percentage = 0,
  start = 0,
  end = 100,
  fg,
  bg,
  tooltipContent,

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
        tooltipContent,
      });
    }

    return p;
  }, [progressItems]);

  return (
    <Wrapper>
      <Background />
      {items.map((item, idx) => (
        <TooltipWrapper
          key={idx}
          start={Number(item.start) || 0}
          end={Math.abs(Number(item.end) || 100)}
          percentage={item.percentage}
          fg={item.fg}
        >
          <Tooltip content={item.tooltipContent}>
            <PercentageWrapper
              bg={item.bg}
              start={Number(item.start) || 0}
              end={Math.abs(Number(item.end) || 100)}
            >
              <Percentage fg={item.fg} percentage={item.percentage} />
            </PercentageWrapper>
          </Tooltip>
        </TooltipWrapper>
      ))}
    </Wrapper>
  );
}
