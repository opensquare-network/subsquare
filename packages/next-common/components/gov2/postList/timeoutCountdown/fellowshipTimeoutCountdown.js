import TimeoutCountDown from "next-common/components/gov2/postList/timeoutCountdown/base";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";

export default function FellowshipTimeoutCountdown({ detail = {} }) {
  const timeout = useUndecidingTimeout("fellowshipReferenda");
  return <TimeoutCountDown detail={detail} timeout={timeout} />;
}
