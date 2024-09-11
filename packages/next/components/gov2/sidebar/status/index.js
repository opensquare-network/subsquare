import { PrepareStatus } from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import StatusWrapper from "./wrapper";
import PreparationProgress from "./preparation";
import PlaceDecisionDeposit from "./preparation/decisionDeposit";
import EnactmentProgress from "./enactment";
import Zoom from "./zoom";
import { ZoomProvider } from "./context/zoomContext";
import DecisionWarning from "./warning";

export default function Gov2Status() {
  const state = usePostState();

  if (gov2State.Approved === state) {
    return (
      <StatusWrapper>
        <EnactmentProgress />
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
    <ZoomProvider>
      <StatusWrapper titleExtra={<Zoom />}>
        <DecisionProgress />
        <ConfirmProgress />
        <DecisionWarning />
      </StatusWrapper>
    </ZoomProvider>
  );
}
