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

function VotesInfo() {
  return (
    <WindowSizeProvider>
      <VotesGroup>
        <VotesInfoLine>
          <VotesGroupLabel>Votes</VotesGroupLabel>
          <VotesGroupItems>
            <NestedVotes />
            <FlattenedVotes />
            <CallsVotes />
          </VotesGroupItems>
        </VotesInfoLine>
      </VotesGroup>
    </WindowSizeProvider>
  );
}

export default memo(VotesInfo);
