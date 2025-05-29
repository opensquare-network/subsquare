import { useOnchainData, usePostState } from "next-common/context/post";
import useChainOrScanHeight from "next-common/hooks/height";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { isNil } from "lodash-es";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import CountDown from "next-common/components/_CountDown";
import Malicious from "next-common/components/detail/malicious";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";

export default function TreasurySpendExpireCountdown() {
  const { meta, indexer } = useOnchainData() || {};
  const { expireAt, validFrom } = meta || {};
  const latestHeight = useChainOrScanHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(expireAt - latestHeight);
  const { timestamp } = useBlockTimestamp(expireAt);
  const state = usePostState();

  if (
    isNil(expireAt) ||
    isNil(indexer?.blockHeight) ||
    isNil(validFrom) ||
    isNil(latestHeight) ||
    latestHeight < validFrom ||
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
        numerator={latestHeight - validFrom}
        denominator={expireAt - validFrom}
        tooltipContent={text}
      />
      <span>{text}</span>
    </CountDownWrapper>
  );
}
