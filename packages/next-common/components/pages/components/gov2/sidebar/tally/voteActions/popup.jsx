import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VoteActionsTable from "./table";

export default function OpenGovVoteActionsPopup({ setShowVoteActions }) {
  return (
    <BaseVotesPopup title="Actions" onClose={() => setShowVoteActions(false)}>
      <VoteActionsTable />
    </BaseVotesPopup>
  );
}
