import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import Tooltip from "../tooltip";

const bar_css = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  height: 8px;
`;

const BarWrapper = styled.div`
  overflow: hidden;
  ${bar_css};
`;

const Bar = styled.div`
  ${bar_css};
`;

const Background = styled(Bar)`
  background-color: var(--neutral200);
`;

const Percentage = styled(Bar)`
  background-color: ${(p) => p.fg};
  width: ${(p) => p.percentage}%;
`;
const Total = styled(Bar)`
  background-color: ${(p) => p.bg};
  left: ${(p) => p.start || 0}%;
  width: ${(p) => (p.end >= 100 ? p.end - p.start : p.end)}%;
  overflow: hidden;
`;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(p) => p.start || 0}%;
  width: ${(p) => (p.end >= 100 ? p.end - p.start : p.end)}%;
  border-radius: 4px;

  /* tooltip children wrapper */
  > div {
    width: ${(p) => p.percentage}%;
    ${bar_css};
  }
`;

const ensureMax100 = (n) => (Number(n) > 100 ? 100 : Number(n));

export default function MultiProgress({ progressItems = [] }) {
  const items = useMemo(() => {
    return progressItems.map((item) => {
      return {
        ...item,
        percentage: ensureMax100(item.percentage),
        start: ensureMax100(item.start),
        end: ensureMax100(item.end),
      };
    });
  }, [progressItems]);

  return (
    <Wrapper>
      <Background />
      <BarWrapper>
        {items.map((item, idx) => (
          <Total key={idx} start={item.start} end={item.end} bg={item.bg}>
            <Percentage percentage={item.percentage} fg={item.fg} />
          </Total>
        ))}
      </BarWrapper>

      {items.map((item, idx) => (
        <TooltipWrapper
          key={idx}
          start={Number(item.start) || 0}
          end={Math.abs(Number(item.end) || 100)}
          percentage={item.percentage > 100 ? 100 : item.percentage}
        >
          <Tooltip content={item.tooltipContent}>
            <Total start={item.start} end={item.end}>
              <Percentage percentage={item.percentage} />
            </Total>
          </Tooltip>
        </TooltipWrapper>
      ))}
    </Wrapper>
  );
}
