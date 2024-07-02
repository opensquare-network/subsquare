import React from "react";
import BaseTimeoutCountdown from "next-common/components/detail/common/openGov/baseTimoutCountdown";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";

export default function FellowshipTimeoutCountdown() {
  const timeout = useUndecidingTimeout("fellowshipReferenda");
  return <BaseTimeoutCountdown timeout={timeout} />;
}
