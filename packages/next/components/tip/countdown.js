import CountDown from "next-common/components/_CountDown";
import { timeDuration } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  nowHeightSelector,
} from "next-common/store/reducers/chainSlice";

export default function Countdown({ onchainData, indexer }) {
  const nowHeight = useSelector(nowHeightSelector);
  const blockTime = useSelector(blockTimeSelector);
  if (!onchainData) {
    return null;
  }
  try {
    const { unlockAt } = onchainData;
    const { blockHeight: awardedAt } =
      indexer ??
      onchainData?.timeline?.reverse().find((item) => item.name === "Awarded")
        ?.indexer;
    const claimable = nowHeight >= unlockAt;
    return (
      <Flex style={{ gap: 8 }}>
        <CountDown
          numerator={nowHeight - tip.height}
          denominator={tip.onchainData.meta.closes - tip.height}
          tooltipContent={`${nowHeight} / ${unlockAt}, ${Math.max(
            0,
            unlockAt - nowHeight
          )} blocks left`}
        />
        <span>
          Claimable{" "}
          {!claimable &&
            `in ${timeDuration((blockTime * (unlockAt - nowHeight)) / 1000)}`}
        </span>
      </Flex>
    );
  } catch (e) {
    console.error(e);
  }
  return null;
}
