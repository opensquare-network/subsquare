import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import CountDown from "components/countDown";
import Tooltip from "./tooltip";
import { useBlockTime } from "utils/hooks";
import { bigNumber2Locale } from "utils";

export default function MotionElapse({ motion, chain }) {
  const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const blockTime = useBlockTime(currentFinalHeight - motionEndHeight, chain)
  const motionClosed = motion?.timeline?.some(item => item.method === "Closed");

  if (motionClosed || !motionEndHeight || !currentFinalHeight || currentFinalHeight >= motionEndHeight || !blockTime) {
    return null;
  }

  const elapsePercent = (currentFinalHeight - motionStartHeight) / (motionEndHeight - motionStartHeight);
  return (
    <Tooltip content={`End in ${blockTime}, #${bigNumber2Locale(motionEndHeight.toString())}`}>
      <CountDown percent={parseInt(elapsePercent * 100)} />
    </Tooltip>
  );
}
