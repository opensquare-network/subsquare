import { useOnchainData, usePostState } from "next-common/context/post";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { isNil } from "lodash-es";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import CountDown from "next-common/components/_CountDown";
import Malicious from "next-common/components/detail/malicious";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

export default function TreasurySpendExpireCountdown() {
  const { meta, indexer } = useOnchainData() || {};
  const { expireAt } = meta || {};
  const latestHeight = useBlockHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(expireAt - latestHeight);
  const { timestamp } = useBlockTimestamp(expireAt);
  const state = usePostState();

  if (
    isNil(expireAt) ||
    isNil(indexer?.blockHeight) ||
    isNil(latestHeight) ||
    ["Paid", "Processed"].includes(state)
  ) {
    return null;
  }

  if (latestHeight >= expireAt) {
    return (
      <Malicious>
        Already expired {timestamp ? formatTimeAgo(timestamp) : null}
      </Malicious>
    );
  }

  const text = `Expire in ${estimatedBlocksTime}`;

  return (
    <CountDownWrapper>
      <CountDown
        numerator={latestHeight - indexer.blockHeight}
        denominator={expireAt - indexer.blockHeight}
        tooltipContent={text}
      />
      <span>{text}</span>
    </CountDownWrapper>
  );
}
