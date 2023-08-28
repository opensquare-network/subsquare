import FlattenedVotes from "../flattenedVotes";
import CallsVotes from "../callsVotes";
import NestedVotes from "../nestedVotes";
import DelegationStatus from "./DelegationStatus";
import {
  VotesGroup,
  VotesGroupItems,
  VotesGroupLabel,
  VotesInfoLine,
} from "./styled";
import { useChainSettings } from "next-common/context/chain";

export default function VotesInfo() {
  const {
    showReferendaReferendumDelegationPercentage: showDelegationPercentage,
  } = useChainSettings();

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
      {showDelegationPercentage && <DelegationStatus />}
    </VotesGroup>
  );
}
