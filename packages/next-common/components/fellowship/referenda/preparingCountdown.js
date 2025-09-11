import {
  PreparingCountdownImpl,
  useRemaining,
} from "next-common/components/gov2/postList/preparingCountdown";
import FellowshipTimeoutCountdown from "next-common/components/gov2/postList/timeoutCountdown/fellowshipTimeoutCountdown";

export default function FellowshipPreparingCountdown({ detail }) {
  const remaining = useRemaining(detail);

  if (remaining <= 0) {
    return <FellowshipTimeoutCountdown detail={detail} />;
  }

  return <PreparingCountdownImpl detail={detail} />;
}
