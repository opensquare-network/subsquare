import { useOnchainData, usePostState } from "next-common/context/post";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale } from "next-common/utils";
import BigNumber from "bignumber.js";
import CountDown from "next-common/components/_CountDown";
import React from "react";
import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import useChainOrScanHeight from "next-common/hooks/height";
import { useDemocracyReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useChainSettings } from "next-common/context/chain";

function ExecutionCountdown() {
  const onchain = useOnchainData();
  const { willExecuteAt } = onchain;
  const blockHeight = useChainOrScanHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(
    willExecuteAt - blockHeight,
  );
  const voteFinishedHeight = useDemocracyVoteFinishedHeight();
  if (!willExecuteAt || !blockHeight || blockHeight >= willExecuteAt) {
    return;
  }

  const shortText = `Execution expected in ${estimatedBlocksTime}`;
  const longText = `${shortText}, #${bigNumber2Locale(
    new BigNumber(willExecuteAt).toString(),
  )}`;
  return (
    <CountDownWrapper>
      <CountDown
        numerator={blockHeight - voteFinishedHeight}
        denominator={willExecuteAt - voteFinishedHeight}
        tooltipContent={longText}
      />
      <span>{shortText}</span>
    </CountDownWrapper>
  );
}

export default function ExecutionCountdownGuide() {
  const { timeline } = useOnchainData();
  const indexer = useDemocracyReferendumVotingFinishIndexer(timeline);
  const { assethubMigration = {} } = useChainSettings();
  const migrationBlockTime = assethubMigration?.timestamp || 0;
  const state = usePostState();

  if (["Executed"].includes(state) || indexer.blockTime < migrationBlockTime) {
    return;
  }

  return <ExecutionCountdown />;
}
