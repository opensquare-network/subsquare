import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import Status from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function Gov2Status() {
  const state = usePostState();

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
    <Wrapper>
      <SecondaryCardDetail>
        <Title>Status</Title>

        <DecisionProgress />
        <ConfirmProgress />

        <Status />
      </SecondaryCardDetail>
    </Wrapper>
  );
}
