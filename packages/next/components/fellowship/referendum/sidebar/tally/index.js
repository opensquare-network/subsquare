import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Aye from "./aye";
import Nay from "./nay";
import BareAye from "./bareAye";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function FellowshipTally() {
  return (
    <SecondaryCardDetail>
      <Title>Tally</Title>

      <Aye />
      <Nay />
      <BareAye />
    </SecondaryCardDetail>
  );
}
