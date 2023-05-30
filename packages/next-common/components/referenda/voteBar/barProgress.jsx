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
  background-color: ${(props) => props.theme.secondaryGreen500};
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: ${(props) => props.theme.secondaryRed500};
  width: ${(p) => p.precent}%;
  height: 100%;
`;

/**
 * @description VoteBar, Bar progress
 */
export default function VoteBarBarProgress({ tally, thin, children, gap }) {
  const { ayesPercent, naysPercent } = getTallyVotesBarPercent(tally);

  return (
    <BarWrapper>
      <BarContainer thin={thin} gap={gap}>
        <AyesBar precent={ayesPercent} />
        <NaysBar precent={naysPercent} />

        {children}
      </BarContainer>
    </BarWrapper>
  );
}
