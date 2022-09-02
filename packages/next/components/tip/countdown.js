import CountDown from "next-common/components/_CountDown";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import { latestHeightSelector, } from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";
import { tipCountDownBlockNumSelector } from "next-common/store/reducers/tipSlice";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import isNil from "lodash.isnil";

export default function Countdown({ closes }) {
  const nowHeight = useSelector(latestHeightSelector);
  const tipCountdownBlockNum = useSelector(tipCountDownBlockNumSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(Math.abs(closes - nowHeight));

  if (!nowHeight || isNil(tipCountdownBlockNum)) {
    return <Loading />;
  }

  const start = closes - tipCountdownBlockNum;
  const goneBlocks = nowHeight - start;
  const allBlocks = tipCountdownBlockNum;
  const reachedClosableHeight = nowHeight >= closes;

  let text = `Closable`
  if (!reachedClosableHeight) {
    text += ` in ${estimatedBlocksTime}`;
  }

  return (
    <Flex style={{ gap: 8 }}>
      <CountDown
        numerator={goneBlocks}
        denominator={allBlocks}
        tooltipContent={`${nowHeight} / ${closes}, ${Math.max(
          0,
          closes - nowHeight
        )} blocks left`}
      />
      <span>{ text }</span>
    </Flex>
  );
}
