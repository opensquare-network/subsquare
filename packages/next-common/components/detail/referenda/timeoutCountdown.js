import React from "react";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";
import BaseTimeoutCountdown from "next-common/components/detail/common/openGov/baseTimoutCountdown";

export default function TimeoutCountdown() {
  const timeout = useUndecidingTimeout();
  return <BaseTimeoutCountdown timeout={timeout} />;
}
