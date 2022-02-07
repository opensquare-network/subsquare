import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import CountDown from "components/countDown";
import Tooltip from "./tooltip";
import { useBlockTime } from "utils/hooks";
import { bigNumber2Locale } from "utils";

export default function MotionElapse({ data, chain }) {
  const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = data.onchainData?.voting?.end;
  const motionStartHeight = data.onchainData?.indexer?.blockHeight;
  const blockTime = useBlockTime(currentFinalHeight - motionEndHeight, chain)

  if (!motionEndHeight || !currentFinalHeight || currentFinalHeight >= motionEndHeight) {
    return null;
  }

  const elapsePercent = (currentFinalHeight - motionStartHeight) / (motionEndHeight - motionStartHeight);
  return (
    <Tooltip content={`End in ${blockTime}, #${bigNumber2Locale(motionEndHeight.toString())}`}>
      <CountDown percent={parseInt(elapsePercent * 100)} />
    </Tooltip>
  );
}
