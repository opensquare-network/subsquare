import Status, { PrepareStatus } from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import StatusWrapper from "./wrapper";
import PreparationProgress from "./preparation";
import PlaceDecisionDeposit from "./preparation/decisionDeposit";
import EnactmentProgress from "./enactment";

export default function Gov2Status() {
  const state = usePostState();

  if (gov2State.Approved === state) {
    return <StatusWrapper>
      <EnactmentProgress />
      <Status />
    </StatusWrapper>;
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
    <StatusWrapper>
      <DecisionProgress />
      <ConfirmProgress />
      <Status />
    </StatusWrapper>
  );
}
