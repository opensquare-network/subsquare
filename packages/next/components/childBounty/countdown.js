import CountDown from "next-common/components/_CountDown";
import { timeDurationSimple } from "next-common/utils";
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
  const { unlockAt } = onchainData;
  const { blockHeight: awardedAt } =
    indexer ?? onchainData.timeline[onchainData?.timeline?.length - 1]?.indexer;
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
          `in ${timeDurationSimple(
            (blockTime * (unlockAt - nowHeight)) / 1000
          )}`}
      </span>
    </Flex>
  );
}
