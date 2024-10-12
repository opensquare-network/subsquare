import React from "react";
import { useEstimateBlocksTime } from "../../../utils/hooks";
import { isNil } from "lodash-es";
import Loading from "../../loading";
import Flex from "../../styled/flex";
import CountDown from "../../_CountDown";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export default function TreasuryCountDown({
  startHeight = 0,
  targetHeight = 0,
  prefix = "End",
}) {
  const nowHeight = useBlockHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(
    Math.abs(targetHeight - nowHeight),
  );

  if (isNil(startHeight) || isNil(targetHeight)) {
    return null;
  }

  if (isNil(nowHeight)) {
    return <Loading />;
  }

  const goneBlocks = nowHeight - startHeight;
  const allBlocks = targetHeight - startHeight;
  const reachedClosableHeight = nowHeight >= targetHeight;

  let text = prefix;
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
          targetHeight - nowHeight,
        )} blocks left`}
      />
      <span>{text}</span>
    </Flex>
  );
}
