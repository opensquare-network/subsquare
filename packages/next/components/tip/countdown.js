import CountDown from "next-common/components/_CountDown";
import { timeDuration } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  nowHeightSelector,
} from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";
import { TipStateMap } from "../../utils/viewfuncs";

export default function Countdown({ tip, indexer }) {
  const nowHeight = useSelector(nowHeightSelector);
  const blockTime = useSelector(blockTimeSelector);
  if (!nowHeight) {
    return <Loading />;
  }
  const closes = tip?.onchainData?.meta?.closes;
  const showCountDown =
    TipStateMap[tip?.state?.state ?? tip?.state] === "Tipping" && closes;

  if (!showCountDown) {
    return null;
  }
  const { blockHeight: tipHeight } = indexer;
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
}
