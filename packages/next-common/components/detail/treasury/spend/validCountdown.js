import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import CountDown from "next-common/components/_CountDown";
import React from "react";

export default function TreasurySpendValidCountdown() {
  const { meta, indexer } = useOnchainData() || {};
  const { validFrom } = meta || {};
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(validFrom - latestHeight);

  if (
    isNil(validFrom) ||
    isNil(indexer?.blockHeight) ||
    isNil(latestHeight) ||
    latestHeight > validFrom
  ) {
    return null;
  }

  const text = `Will be valid in ${estimatedBlocksTime}`;
  return (
    <CountDownWrapper>
      <CountDown
        numerator={latestHeight - indexer.blockHeight}
        denominator={validFrom - indexer.blockHeight}
        tooltipContent={text}
      />
      <span>{text}</span>
    </CountDownWrapper>
  );
}
