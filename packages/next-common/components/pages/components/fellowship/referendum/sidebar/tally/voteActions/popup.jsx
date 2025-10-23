import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VoteActionsTable from "./table";
import useVoteSearch from "./useVoteSearch";

export default function FellowshipVoteActionsPopup({ setShowVoteActions }) {
  const { search, searchBtn, searchBar } = useVoteSearch();

  return (
    <BaseVotesPopup
      title="Actions"
      onClose={() => setShowVoteActions(false)}
      className="!w-[960px] max-sm:w-full"
      extra={searchBtn}
    >
      {searchBar}
      <VoteActionsTable search={search} />
    </BaseVotesPopup>
  );
}
