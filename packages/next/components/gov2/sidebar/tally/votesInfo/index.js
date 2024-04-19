import FlattenedVotes from "../flattenedVotes";
import CallsVotes from "../callsVotes";
import NestedVotes from "../nestedVotes";
import {
  VotesGroup,
  VotesGroupItems,
  VotesGroupLabel,
  VotesInfoLine,
} from "./styled";

export default function VotesInfo() {
  return (
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
  );
}
