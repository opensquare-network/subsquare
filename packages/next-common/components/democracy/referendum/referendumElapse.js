import React from "react";
import { useSelector } from "react-redux";
import { referendumVoteFinishedStatusArray } from "../../../utils/democracy/referendum";
import { useEstimateBlocksTime } from "../../../utils/hooks";
import CountDown from "../../_CountDown";
import { bigNumber2Locale } from "../../../utils";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

function getMeta(onchain) {
  if (onchain.meta) {
    return onchain.meta;
  }

  if (onchain.status) {
    return onchain.status;
  }

  if (onchain.info?.ongoing) {
    return onchain.info.ongoing;
  }

  throw new Error(`Can not get meta of referendum ${onchain.referendumIndex}`);
}

export default function ReferendumElapse({ detail }) {
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const onchain = detail?.onchainData;
  const timeline = onchain.timeline || [];
  const isFinished = (timeline || []).some((item) =>
    referendumVoteFinishedStatusArray.includes(item.method),
  );
  const startHeight = onchain.indexer?.blockHeight;
  const meta = getMeta(onchain);
  const estimatedBlocksTime = useEstimateBlocksTime(meta.end - blockHeight);

  if (isFinished || !blockHeight || !estimatedBlocksTime) {
    return null;
  }

  if (blockHeight > meta.end) {
    return null;
  }

  return (
    <CountDown
      numerator={blockHeight - startHeight}
      denominator={meta.end - startHeight}
      tooltipContent={`End in ${estimatedBlocksTime}, #${bigNumber2Locale(
        meta.end.toString(),
      )}`}
    />
  );
}
