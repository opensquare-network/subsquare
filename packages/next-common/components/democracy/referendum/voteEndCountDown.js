import useDemocracyMeta from "../../../context/post/democracy/referendum/useDemocracyMeta";
import { useOnchainData } from "../../../context/post";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import useIsDemocracyVoteFinished from "../../../context/post/democracy/referendum/isVoteFinished";
import CountDown from "../../_CountDown";
import React from "react";
import { useEstimateBlocksTime } from "../../../utils/hooks";
import { bigNumber2Locale } from "../../../utils";
import { CountDownWrapper } from "next-common/components/detail/common/styled";

export default function ReferendumVoteEndCountDown() {
  const onchain = useOnchainData();
  const { end } = useDemocracyMeta();
  const blockHeight = useSelector(latestHeightSelector);
  const isVoteFinished = useIsDemocracyVoteFinished();
  const startHeight = onchain.indexer?.blockHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(
    end - blockHeight,
  );

  if (isVoteFinished || !blockHeight || !estimatedBlocksTime) {
    return null;
  }

  if (blockHeight > end) {
    return null;
  }

  const tooltipContent = `End in ${estimatedBlocksTime}, #${bigNumber2Locale(end.toString())}`;
  return <CountDownWrapper>
    <CountDown
      numerator={blockHeight - startHeight}
      denominator={end - startHeight}
      tooltipContent={tooltipContent}
    />
    <span>{tooltipContent}</span>
  </CountDownWrapper>;
}
