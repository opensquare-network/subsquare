import FlattenedVotes from "../flattenedVotes";
import CallsVotes from "../callsVotes";
import NestedVotes from "../nestedVotes";
import {
  VotesGroup,
  VotesGroupItems,
  VotesGroupLabel,
  VotesInfoLine,
} from "./styled";
import { memo } from "react";
import VoteActions from "../voteActions";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";

function ConditionalVotes() {
  const showVoteActions = useShowVoteActions();

  return showVoteActions ? <VoteActions /> : <CallsVotes />;
}

function VotesInfo() {
  return (
    <VotesGroup>
      <VotesInfoLine>
        <VotesGroupLabel>Votes</VotesGroupLabel>
        <VotesGroupItems>
          <NestedVotes />
          <FlattenedVotes />
          <ConditionalVotes />
        </VotesGroupItems>
      </VotesInfoLine>
    </VotesGroup>
  );
}

export default memo(VotesInfo);
