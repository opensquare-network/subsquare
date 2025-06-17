import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";

export default function OpenGovVoteActionsPopup({ setShowVoteActions }) {
  return (
    <BaseVotesPopup title="Actions" onClose={() => setShowVoteActions(false)}>
      Actions popup content
    </BaseVotesPopup>
  );
}
