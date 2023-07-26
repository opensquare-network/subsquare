import Status, { PrepareStatus } from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import StatusWrapper from "./wrapper";
import PreparationProgress from "./preparation";
import PlaceDecisionDeposit from "./preparation/decisionDeposit";
import EnactmentProgress from "./enactment";
import { useState } from "react";
import { SystemZoomIn, SystemZoomOut } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";

export default function Gov2Status() {
  const state = usePostState();
  const isConfirming = gov2State.Confirming === state;
  const [confirmationMode, setConfirmationMode] = useState(
    isConfirming ? "zoom-in" : "zoom-out",
  );

  if (gov2State.Approved === state) {
    return (
      <StatusWrapper>
        <EnactmentProgress />
        <Status />
      </StatusWrapper>
    );
  }

  if (gov2State.Preparing === state) {
    return (
      <StatusWrapper>
        <PreparationProgress />
        <PrepareStatus />
        <PlaceDecisionDeposit />
      </StatusWrapper>
    );
  }

  if (
    ![
      gov2State.Deciding,
      gov2State.Confirming,
      gov2State.Approved,
      gov2State.Executed,
      gov2State.Rejected,
    ].includes(state)
  ) {
    return null;
  }

  return (
    <StatusWrapper
      titleExtra={
        isConfirming ? (
          <Tooltip
            content={confirmationMode === "zoom-in" ? "Zoom Out" : "Zoom In"}
          >
            {confirmationMode === "zoom-in" ? (
              <SystemZoomOut
                role="button"
                className="w-5 h-5 [&_path]:fill-textTertiary"
                onClick={() => {
                  setConfirmationMode("zoom-out");
                }}
              />
            ) : (
              <SystemZoomIn
                role="button"
                className="w-5 h-5 [&_path]:fill-textTertiary"
                onClick={() => {
                  setConfirmationMode("zoom-in");
                }}
              />
            )}
          </Tooltip>
        ) : null
      }
    >
      <DecisionProgress />
      <ConfirmProgress mode={confirmationMode} />
      <Status />
    </StatusWrapper>
  );
}
