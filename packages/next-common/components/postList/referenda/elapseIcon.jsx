import { gov2State } from "next-common/utils/consts/state";
import ConfirmCountdown from "next-common/components/gov2/postList/confirmCountdown";
import DecisionCountdown from "next-common/components/gov2/postList/decisionCountdown";
import PreparingCountdown from "next-common/components/gov2/postList/preparingCountdown";

export default function ElapseIcon({ data }) {
  if (data?.status === gov2State.Preparing) {
    return <PreparingCountdown detail={data} isFellowship={false} />;
  }
  if (data?.status === gov2State.Deciding) {
    return <DecisionCountdown detail={data} />;
  }
  if (data?.status === gov2State.Confirming) {
    return <ConfirmCountdown detail={data} />;
  }
}
