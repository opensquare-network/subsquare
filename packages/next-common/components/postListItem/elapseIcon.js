import React from "react";
import businessCategory from "next-common/utils/consts/business/category";
import MotionElapse from "../motionElapse";
import { gov2State } from "next-common/utils/consts/state";
import PreparingCountdown from "../gov2/postList/preparingCountdown";
import DecisionCountdown from "../gov2/postList/decisionCountdown";
import ConfirmCountdown from "../gov2/postList/confirmCountdown";
import ReferendumElapse from "../democracy/referendum/referendumElapse";
import { isDemocracyCollective, isGov2Referendum } from "./utils";

export default function ElapseIcon({ data, type }) {
  if (!data) {
    return;
  }

  if (isDemocracyCollective(type)) {
    return <MotionElapse motion={data?.onchainData} />;
  }

  if (isGov2Referendum(type)) {
    if (data?.status === gov2State.Preparing) {
      return (
        <PreparingCountdown
          detail={data}
          isFellowship={businessCategory.fellowship === type}
        />
      );
    } else if (data?.status === gov2State.Deciding) {
      return <DecisionCountdown detail={data} />;
    } else if (data?.status === gov2State.Confirming) {
      return <ConfirmCountdown detail={data} />;
    }
  }

  if (businessCategory.democracyReferenda === type) {
    return <ReferendumElapse detail={data} />;
  }
}
