import styled from "styled-components";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";
import Calls from "./voteCalls";
import Votes from "./votes";

const VotesGroup = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
  margin-top: 16px;
`;
const VotesGroupLabel = styled.div`
  ${p_12_medium};
  color: var(--textPrimary);
`;
const VotesGroupItems = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
`;

export default function VotesInfo() {
  return (
    <VotesGroup>
      <VotesGroupLabel>Votes</VotesGroupLabel>
      <VotesGroupItems>
        <Votes />
        <Calls />
      </VotesGroupItems>
    </VotesGroup>
  );
}
