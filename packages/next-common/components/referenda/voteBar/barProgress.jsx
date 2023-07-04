import React from "react";
import styled, { css } from "styled-components";
import { getTallyVotesBarPercent } from "next-common/utils/referendumCommon";

const BarWrapper = styled.div`
  position: relative;
  padding: 8px 0;
  width: 100%;
`;

const BarContainer = styled.div`
  display: flex;
  gap: ${(p) => p.gap}px;
  height: 8px;
  ${(p) =>
    p.thin &&
    css`
      height: 4px;
    `}
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

const AyesBar = styled.div`
  background-color: var(--green500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: var(--red500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;

/**
 * @description VoteBar, Bar progress
 */
export default function VoteBarBarProgress({ tally, thin, children, gap = 2 }) {
  const { ayesPercent, naysPercent } = getTallyVotesBarPercent(tally);
  let ayesBarPercent = ayesPercent;
  let naysBarPercent = naysPercent;

  if (ayesPercent > 99 && ayesPercent < 100) {
    ayesBarPercent = 99;
  } else if (ayesPercent < 1 && ayesPercent > 0) {
    ayesBarPercent = 1;
  }
  naysBarPercent = 100 - ayesBarPercent;

  if (ayesPercent === 0 || ayesPercent === 100) {
    gap = 0;
  }

  return (
    <BarWrapper>
      <BarContainer thin={thin} gap={gap}>
        <AyesBar precent={ayesBarPercent} />
        <NaysBar precent={naysBarPercent} />

        {children}
      </BarContainer>
    </BarWrapper>
  );
}
