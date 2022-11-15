import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";
import Status from "./status";
import DecisionProgress from "./DecisionProgress";
import ConfirmProgress from "./ConfirmProgress";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function Gov2Status() {
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
