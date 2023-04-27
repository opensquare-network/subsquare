import Status, { PrepareStatus } from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import StatusWrapper from "./wrapper";
import PreparationProgress from "./preparation";
import PlaceDecisionDeposit from "./preparation/decisionDeposit";
import { emptyFunction } from "next-common/utils";

export default function Gov2Status({ onDecisionDepositFinalized = emptyFunction }) {
  const state = usePostState();

  if (gov2State.Preparing === state) {
    return (
      <StatusWrapper>
        <PreparationProgress />
        <PrepareStatus />
        <PlaceDecisionDeposit onDecisionDepositFinalized={onDecisionDepositFinalized} />
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
