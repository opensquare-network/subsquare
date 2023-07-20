import styled from "styled-components";
import SubLink from "next-common/components/styled/subLink";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";
import { useState } from "react";
import CheckAllVotesPopup from "components/democracy/allVotesPopup";
import Calls from "./voteCalls";

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

export default function VotesLists() {
  const [showVoteList, setShowVoteList] = useState(false);

  return (
    <>
      <VotesGroup>
        <VotesGroupLabel>Votes</VotesGroupLabel>
        <VotesGroupItems>
          <SubLink onClick={() => setShowVoteList(true)}>Votes</SubLink>
          <Calls />
        </VotesGroupItems>
      </VotesGroup>
      {showVoteList && <CheckAllVotesPopup setShowVoteList={setShowVoteList} />}
    </>
  );
}
