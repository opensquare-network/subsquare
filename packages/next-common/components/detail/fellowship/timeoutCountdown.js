import React from "react";
import BaseTimeoutCountdown from "next-common/components/detail/common/openGov/baseTimoutCountdown";
import useFellowshipUndecidingTimeout from "next-common/hooks/fellowship/useFellowshipUndecidingTimeout";

export default function FellowshipTimeoutCountdown() {
  const timeout = useFellowshipUndecidingTimeout();
  return <BaseTimeoutCountdown timeout={timeout} />;
}
