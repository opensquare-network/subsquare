import CountDown from "next-common/components/_CountDown";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import { latestHeightSelector, } from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";
import isNil from "lodash.isnil";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function Countdown({ unlockAt, indexer }) {
  const nowHeight = useSelector(latestHeightSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(Math.abs(unlockAt - nowHeight));
  if (!unlockAt || isNil(indexer)) {
    return null;
  }

  if (!nowHeight) {
    return <Loading />;
  }

  const start = indexer.blockHeight; // block height at which the award extrinsic happen
  const goneBlocks = nowHeight - start;
  const allBlocks = unlockAt - start;

  const reachedClaimableHeight = nowHeight >= unlockAt;
  let text = `Claimable`
  if (!reachedClaimableHeight) {
    text += ` in ${estimatedBlocksTime}`;
  }

  return (
    <Flex style={ { gap: 8 } }>
      <CountDown
        numerator={goneBlocks}
        denominator={ allBlocks }
        tooltipContent={ `${ nowHeight } / ${ unlockAt }, ${ Math.max(
          0,
          unlockAt - nowHeight
        ) } blocks left` }
      />
      <span>{ text }</span>
    </Flex>
  );
}
