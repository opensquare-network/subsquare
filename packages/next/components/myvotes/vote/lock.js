import CountDown from "next-common/components/_CountDown";
import React from "react";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import styled from "styled-components";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";

export const CountDownWrapper = styled(NoticeWrapper)`
  width: 100%;
  justify-content: left;
  gap: 8px;
  margin: 0;
  padding: 4px 8px;
  span {
    font-size: 12px;
    line-height: 1;
  }
`;

function LockExpired({ lockEnd }) {
  const blockHeight = useSelector(latestHeightSelector);
  const tooltip = `Unlock at ${lockEnd}, now ${blockHeight}`;
  return (
    <CountDownWrapper>
      <CountDown numerator={100} denominator={100} tooltipContent={tooltip} />
      <span>Lock expired</span>
    </CountDownWrapper>
  );
}

function LockCountDown({ lockInfo }) {
  const blockHeight = useSelector(latestHeightSelector);
  const { voteEnd, lockEnd } = lockInfo;
  const estimatedBlocksTime = useEstimateBlocksTime(lockEnd - blockHeight);
  if (!voteEnd || !lockEnd) {
    return null;
  }

  if (blockHeight >= lockEnd) {
    return <LockExpired lockEnd={lockEnd} />;
  }

  const shortText = `Lock expired in ${estimatedBlocksTime}`;
  const tooltip = `Expired at ${lockEnd}, blocks remaining ${
    lockEnd - blockHeight
  }`;
  return (
    <CountDownWrapper>
      <CountDown
        numerator={blockHeight - voteEnd}
        denominator={lockEnd - voteEnd}
        tooltipContent={tooltip}
      />
      <span>{shortText}</span>
    </CountDownWrapper>
  );
}

export default function VoteLock({ lockInfo }) {
  const { hasLock } = lockInfo;
  const blockHeight = useSelector(latestHeightSelector);
  if (!hasLock || !blockHeight) {
    return null;
  }

  return <LockCountDown lockInfo={lockInfo} />;
}
