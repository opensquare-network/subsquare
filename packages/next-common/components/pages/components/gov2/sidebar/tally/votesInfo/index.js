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
import { memo, useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import VoteActions from "../voteActions";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";

function ConditionalVotes() {
  const { referendumIndex } = useOnchainData();
  const { referendaActions } = useChainSettings();

  const shouldUseVoteActions = useMemo(() => {
    if (
      isNil(referendumIndex) ||
      isNil(referendaActions) ||
      isNil(referendaActions?.startFrom)
    ) {
      return false;
    }

    return referendumIndex >= referendaActions?.startFrom;
  }, [referendaActions, referendumIndex]);

  return shouldUseVoteActions ? <VoteActions /> : <CallsVotes />;
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
