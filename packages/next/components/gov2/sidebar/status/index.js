import Status, { PrepareStatus } from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import StatusWrapper from "./wrapper";
import PreparationProgress from "./preparation";

export default function Gov2Status() {
  const state = usePostState();

  if (gov2State.Preparing === state) {
    // todo: show preparing status component
    return (
      <StatusWrapper>
        <PreparationProgress />
        <PrepareStatus />
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
