import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import VoteActionsTable from "./table";

export default function OpenGovVoteActionsPopup({ setShowVoteActions }) {
  return (
    <BaseVotesPopup
      title="Actions"
      onClose={() => setShowVoteActions(false)}
      className="!w-[720px] max-sm:w-full"
    >
      <PopupListWrapper>
        <VoteActionsTable />
      </PopupListWrapper>
    </BaseVotesPopup>
  );
}
