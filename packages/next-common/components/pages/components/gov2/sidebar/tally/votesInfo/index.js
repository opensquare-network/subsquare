import FlattenedVotes from "../flattenedVotes";
import CallsVotes from "../callsVotes";
import NestedVotes from "../nestedVotes";
import {
  VotesGroup,
  VotesGroupItems,
  VotesGroupLabel,
  VotesInfoLine,
} from "./styled";
import WindowSizeProvider from "next-common/context/windowSize";
import { memo } from "react";
import VoteActions from "../voteActions";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";

function ConditionalVotes() {
  const showVoteActions = useShowVoteActions();

  return showVoteActions ? <VoteActions /> : <CallsVotes />;
}

function VotesInfo() {
  return (
    <WindowSizeProvider>
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
    </WindowSizeProvider>
  );
}

export default memo(VotesInfo);
