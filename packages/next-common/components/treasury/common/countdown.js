import React from "react";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import { useEstimateBlocksTime } from "../../../utils/hooks";
import isNil from "lodash.isnil";
import Loading from "../../loading";
import Flex from "../../styled/flex";
import CountDown from "../../_CountDown";

export default function TreasuryCountDown({ startHeight = 0, targetHeight = 0, prefix = 'End' }) {
  const nowHeight = useSelector(latestHeightSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(Math.abs(targetHeight - nowHeight));

  if (isNil(startHeight) || isNil(targetHeight)) {
    return null;
  }

  if (isNil(nowHeight)) {
    return <Loading />;
  }

  const goneBlocks = nowHeight - startHeight;
  const allBlocks = targetHeight - startHeight;
  const reachedClosableHeight = nowHeight >= targetHeight;

  let text = prefix
  if (!reachedClosableHeight) {
    text += ` in ${estimatedBlocksTime}`;
  }

  return (
    <Flex style={{ gap: 8 }}>
      <CountDown
        numerator={goneBlocks}
        denominator={allBlocks}
        tooltipContent={`${nowHeight} / ${targetHeight}, ${Math.max(
          0,
          targetHeight - nowHeight
        )} blocks left`}
      />
      <span>{ text }</span>
    </Flex>
  );
}
