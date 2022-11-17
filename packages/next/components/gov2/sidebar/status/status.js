import styled from "styled-components";
import { gov2State } from "next-common/utils/consts/state";
import { useMemo } from "react";
import { usePostState } from "next-common/context/post";

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

export default function Status() {
  const state = usePostState();
  // same logic: `show confirming period`
  const isPositiveState = useMemo(
    () =>
      [gov2State.Confirming, gov2State.Approved, gov2State.Executed].includes(
        state
      ),
    [state]
  );

  const showState = useMemo(() => {
    if (gov2State.Executed === state) {
      return gov2State.Approved;
    }
    return state;
  }, [state]);

  const Component = isPositiveState ? PositiveStatus : DecidingStatus;

  return <Component>{showState}</Component>;
}
