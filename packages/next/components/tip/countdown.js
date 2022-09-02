import CountDown from "next-common/components/_CountDown";
import { timeDuration } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  nowHeightSelector,
} from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";

export default function Countdown({ onchainData, indexer }) {
  const nowHeight = useSelector(nowHeightSelector);
  const blockTime = useSelector(blockTimeSelector);
  if (!onchainData) {
    return null;
  }
  if (!nowHeight) {
    return <Loading />;
  }
  try {
    const {
      meta: { closes },
    } = onchainData;
    const { blockHeight: tipHeight } =
      indexer ??
      onchainData?.timeline?.reverse().find((item) => item.name === "Awarded")
        ?.indexer;
    const closed = nowHeight >= closes;
    return (
      <Flex style={{ gap: 8 }}>
        <CountDown
          numerator={nowHeight - tipHeight}
          denominator={closes - tipHeight}
          tooltipContent={`${nowHeight} / ${closes}, ${Math.max(
            0,
            closes - nowHeight
          )} blocks left`}
        />
        <span>
          Closable{" "}
          {!closed &&
            `in ${timeDuration((blockTime * (closes - nowHeight)) / 1000, "")}`}
        </span>
      </Flex>
    );
  } catch (e) {
    console.error(e);
  }
  return null;
}
