import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import { useMemo } from "react";
import { gov2State } from "next-common/utils/consts/state";
import Status from "./status";
import { usePostState } from "next-common/context/post";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function Gov2Status() {
  const state = usePostState();

  // same logic: `show confirming period`
  const isPositiveState = useMemo(
    () =>
      [gov2State.Confirming, gov2State.Approved, gov2State.Executed].includes(
        state
      ),
    [state]
  );

  return (
    <Wrapper>
      <SecondaryCardDetail>
        <Title>Status</Title>

        <DecisionProgress />
        {isPositiveState && <ConfirmProgress />}

        <Status state={state} />
      </SecondaryCardDetail>
    </Wrapper>
  );
}
