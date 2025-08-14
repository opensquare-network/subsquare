import React from "react";
import { getTallyVotesBarPercent } from "next-common/utils/referendumCommon";
import {
  BarWrapper,
  BarContainer,
  AyesBar,
  NaysBar,
} from "next-common/components/styled/barProgress";

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
