import CountDown from "next-common/components/_CountDown";
import { timeDuration } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  nowHeightSelector,
} from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";
import isNil from "lodash.isnil";

export default function Countdown({ onchainData, indexer }) {
  const nowHeight = useSelector(nowHeightSelector);
  const blockTime = useSelector(blockTimeSelector);
  if (!nowHeight) {
    return <Loading />;
  }
  const timeline = onchainData?.timeline ?? [];
  const awardedIndexer =
    indexer ??
    timeline?.reverse().find((item) => item.name === "Awarded")?.indexer;

  if (!onchainData || isNil(timeline) || isNil(awardedIndexer)) {
    return null;
  }

  const { unlockAt } = onchainData;
  const { blockHeight: awardedAt } = awardedIndexer;
  const claimable = nowHeight >= unlockAt;
  return (
    <Flex style={{ gap: 8 }}>
      <CountDown
        numerator={Math.min(unlockAt, nowHeight) - awardedAt}
        denominator={unlockAt - awardedAt}
        tooltipContent={`${nowHeight} / ${unlockAt}, ${Math.max(
          0,
          unlockAt - nowHeight
        )} blocks left`}
      />
      <span>
        Claimable{" "}
        {!claimable &&
          `in ${timeDuration((blockTime * (unlockAt - nowHeight)) / 1000, "")}`}
      </span>
    </Flex>
  );
}
