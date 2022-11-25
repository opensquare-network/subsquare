import { memo } from "react";
import BigNumber from "bignumber.js";
import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "utils/referendumUtil";
import Threshold from "./threshold";

const Wrapper = styled.div``;

const Headers = styled(Flex)`
  justify-content: space-between;
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary};

  span:nth-child(2) {
    text-align: center;
    white-space: nowrap;
  }

  span:nth-child(3) {
    text-align: right;
  }
`;

const Contents = styled(Headers)`
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};
  margin-top: 8px !important;
  margin-bottom: 16px;
`;

const BarWrapper = styled.div`
  position: relative;
`;

const BarContainer = styled.div`
  margin-bottom: 1rem;
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

function VoteBar({ tally, electorate, threshold, thin = false }) {
  const ayes = tally?.ayes ?? 0;
  const nays = tally?.nays ?? 0;
  const turnout = tally?.turnout ?? 0;

  let ayesPercent = 50;
  let naysPercent = 50;
  let gap = 2;
  const nTotal = new BigNumber(ayes).plus(nays);
  if (nTotal.gt(0)) {
    ayesPercent = Math.round(new BigNumber(ayes).div(nTotal).toNumber() * 100);
    naysPercent = 100 - ayesPercent;
    if (ayesPercent === 100 || naysPercent === 100) {
      gap = 0;
    }
  }

  return (
    <Wrapper>
      <BarWrapper>
        <BarContainer thin={thin} gap={gap}>
          <AyesBar precent={ayesPercent} />
          <NaysBar precent={naysPercent} />

          {(threshold || "").toLowerCase() === "simplemajority" && (
            <Threshold thin={thin} threshold={getThresholdOfSimplyMajority()} />
          )}

          {(threshold || "").toLowerCase() === "supermajorityapprove" && (
            <Threshold
              thin={thin}
              threshold={getThresholdOfSuperMajorityApprove(
                turnout,
                electorate
              )}
            />
          )}

          {(threshold || "").toLowerCase() === "supermajorityagainst" && (
            <Threshold
              thin={thin}
              threshold={getThresholdOfSuperMajorityAgainst(
                turnout,
                electorate
              )}
            />
          )}
        </BarContainer>
      </BarWrapper>

      <Headers>
        <span>Aye</span>
        <span>Passing threshold</span>
        <span>Nay</span>
      </Headers>

      <Contents>
        <span>{ayesPercent}%</span>
        <span>{threshold}</span>
        <span>{naysPercent}%</span>
      </Contents>
    </Wrapper>
  );
}

export default memo(VoteBar);
