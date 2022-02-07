import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import CountDown from "components/countDown";
import { useBlockTime } from "utils/hooks";
import { bigNumber2Locale } from "utils";

export default function MotionEnd({ motion, type = "full", chain }) {
  const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const motionClosed = motion?.timeline?.some(item => item.method === "Closed");
  const blockTime = useBlockTime(currentFinalHeight - motionEndHeight, chain);

  if (motionClosed || !motionEndHeight || !currentFinalHeight || currentFinalHeight >= motionEndHeight || !blockTime) {
    return null;
  }

  const elapsePercent = (currentFinalHeight - motionStartHeight) / (motionEndHeight - motionStartHeight);
  return (
    <>
      <CountDown percent={parseInt(elapsePercent * 100)} />
      {
        type === "full"
        ? <span>{`End in ${blockTime}, #${bigNumber2Locale(motionEndHeight.toString())}`}</span>
        : type === "simple"
        ? <span>{`End in ${blockTime}`}</span>
        : null
      }
    </>
  );
}
