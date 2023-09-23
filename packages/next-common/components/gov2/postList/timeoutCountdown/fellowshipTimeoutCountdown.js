import TimeoutCountDown from "next-common/components/gov2/postList/timeoutCountdown/base";
import useFellowshipUndecidingTimeout from "next-common/hooks/fellowship/useFellowshipUndecidingTimeout";

export default function FellowshipTimeoutCountdown({ detail = {} }) {
  const timeout = useFellowshipUndecidingTimeout();
  return <TimeoutCountDown detail={detail} timeout={timeout} />;
}
