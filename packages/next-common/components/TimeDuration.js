import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import TimeDurationWithBlockTime from "./TimeDurationWithBlockTime";

export default function TimeDuration(props) {
  const blockTime = useSelector(blockTimeSelector);

  return <TimeDurationWithBlockTime {...props} blockTime={blockTime} />;
}
