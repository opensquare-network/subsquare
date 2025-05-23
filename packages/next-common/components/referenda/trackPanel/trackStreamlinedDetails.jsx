import React, { memo } from "react";
import useTrackDetail from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { startCase } from "lodash-es";
import { Wrapper, LineBox, LineTitle, LineValue, Divider } from "./lineItem";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime, toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { SummaryGreyText } from "next-common/components/summary/styled";

function TrackStreamlinedDetails({ trackId, activeCount }) {
  const trackDetails = useTrackDetail(trackId);
  const { decimals, symbol } = useChainSettings();
  const blockTime = useSelector(blockTimeSelector);

  if (isNil(trackDetails)) return null;

  const {
    id,
    name,
    description,
    maxDeciding,
    preparePeriod,
    decisionPeriod,
    confirmPeriod,
    decisionDeposit,
    minEnactmentPeriod,
  } = trackDetails;

  const preparePeriodBlockTime = estimateBlocksTime(
    preparePeriod,
    blockTime,
  ).split(" ");
  const decisionPeriodBlockTime = estimateBlocksTime(
    decisionPeriod,
    blockTime,
  ).split(" ");
  const confirmPeriodBlockTime = estimateBlocksTime(
    confirmPeriod,
    blockTime,
  ).split(" ");
  const minEnactPeriodBlockTime = estimateBlocksTime(
    minEnactmentPeriod,
    blockTime,
  ).split(" ");

  return (
    <Wrapper className="w-[320px] shadow-200">
      <p className="text16Bold text-textPrimary leading-6">{`[${
        id ?? "-"
      }] Origin: ${startCase(name) ?? "-"}`}</p>
      <p className="text14Medium text-textSecondary">{description ?? "-"}</p>
      <Divider className="my-3" />
      <LineBox>
        <LineTitle title="Capacity" />
        <LineValue>
          <span>{activeCount}</span>
          <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Confirm Period" />
        <LineValue>
          <span>
            {confirmPeriodBlockTime?.[0] || 0}
            {confirmPeriodBlockTime[1]}
          </span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Prepare Period" />
        <LineValue>
          <span>
            {preparePeriodBlockTime?.[0] || 0}
            {preparePeriodBlockTime[1]}
          </span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Decision Period" />
        <LineValue>
          <span>
            {decisionPeriodBlockTime?.[0] || 0}
            {decisionPeriodBlockTime[1]}
          </span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Min Enact Period" />
        <LineValue>
          <span>
            {minEnactPeriodBlockTime?.[0] || 0}
            {minEnactPeriodBlockTime[1]}
          </span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Decision Deposit" />
        <LineValue>
          <span>
            <ValueDisplay
              value={toPrecision(decisionDeposit, decimals)}
              symbol={symbol}
            />
          </span>
        </LineValue>
      </LineBox>
    </Wrapper>
  );
}

export default memo(TrackStreamlinedDetails);
