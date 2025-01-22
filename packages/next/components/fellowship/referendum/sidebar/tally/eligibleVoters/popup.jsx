import Popup from "next-common/components/popup/wrapper/Popup";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import UnVoted from "./unVoted";
import Voted from "./voted";
import useCollectiveEligibleVoters from "next-common/utils/hooks/collectives/useCollectiveEligibleVoters";
import { noop } from "lodash-es";
import useRankedCollectiveMinRank from "next-common/hooks/collectives/useRankedCollectiveMinRank";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

function HeaderPrompt() {
  const minRank = useRankedCollectiveMinRank();
  const votingFinishIndexer = useReferendumVotingFinishIndexer();

  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      Only members{votingFinishIndexer ? "(in the voting time scope)" : ""}{" "}
      whose rank &gt;= {minRank} can vote.
    </GreyPanel>
  );
}

export default function EligibleVotersPopup({ onClose = noop }) {
  const { votedMembers, unVotedMembers, isLoading } =
    useCollectiveEligibleVoters();

  return (
    <Popup title="All votes" onClose={onClose} className="max-h-[640px]">
      <HeaderPrompt />
      <div className="max-h-[450px] overflow-auto">
        <Voted votedMembers={votedMembers} isLoading={isLoading} />
        <UnVoted unVotedMembers={unVotedMembers} isLoading={isLoading} />
      </div>
    </Popup>
  );
}
