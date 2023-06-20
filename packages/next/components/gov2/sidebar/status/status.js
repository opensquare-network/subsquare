import styled from "styled-components";
import { gov2State } from "next-common/utils/consts/state";
import { useMemo } from "react";
import { usePostState } from "next-common/context/post";
import { useDecisionDeposit } from "next-common/context/post/gov2/referendum";

const StatusBase = styled.div`
  margin-top: 8px !important;
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
`;

const DecidingStatus = styled(StatusBase)`
  color: ${(props) => props.theme.secondaryBlue500};
  background: ${(props) => props.theme.secondaryBlue100};
`;

const PositiveStatus = styled(StatusBase)`
  color: ${(props) => props.theme.secondaryGreen500};
  background: ${(props) => props.theme.secondaryGreen100};
`;

const NegativeStatus = styled(StatusBase)`
  color: var(--red500);
  background: var(--red100);
`;

export function PrepareStatus() {
  const deposit = useDecisionDeposit();

  return <DecidingStatus>
    { deposit ? gov2State.Preparing : "Waiting for Decision Deposit" }
  </DecidingStatus>;
}

export default function Status() {
  const state = usePostState();
  // same logic: `show confirming period`
  const isPositiveState = useMemo(
    () => [gov2State.Confirming, gov2State.Approved, gov2State.Executed].includes(state),
    [state]
  );
  const isNegativeState = useMemo(() =>
      [gov2State.Rejected, gov2State.Killed, gov2State.TimedOut, gov2State.Cancelled].includes(state),
    [state]
  );

  const showState = useMemo(() => {
    if (gov2State.Executed === state) {
      return gov2State.Approved;
    }
    return state;
  }, [state]);

  let Component = DecidingStatus;
  if (isPositiveState) {
    Component = PositiveStatus;
  } else if (isNegativeState) {
    Component = NegativeStatus;
  }

  return <Component>{showState}</Component>;
}
