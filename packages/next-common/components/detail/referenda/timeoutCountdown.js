import React from "react";
import useUndecidingTimeout from "next-common/hooks/referenda/useUndecidingTimeout";
import BaseTimeoutCountdown from "next-common/components/detail/common/openGov/baseTimoutCountdown";

export default function TimeoutCountdown() {
  const timeout = useUndecidingTimeout();
  return <BaseTimeoutCountdown timeout={timeout} />;
}
