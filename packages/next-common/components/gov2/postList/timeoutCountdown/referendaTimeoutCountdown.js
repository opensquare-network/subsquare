import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";
import TimeoutCountDown from "next-common/components/gov2/postList/timeoutCountdown/base";

export default function ReferendaTimeoutCountdown({ detail = {} }) {
  const timeout = useUndecidingTimeout();
  return <TimeoutCountDown detail={detail} timeout={timeout} />;
}
