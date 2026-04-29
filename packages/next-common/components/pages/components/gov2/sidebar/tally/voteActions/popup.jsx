import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import VoteActionsTable from "./table";
import useVoteSearch from "./useVoteSearch";
import { DropdownFilterProvider } from "next-common/components/dropdownFilter/context";
import { defaultVoteActionFilterValues } from "./useVoteActionsFilter";
import VoteActionsFilter from "./voteActionsFilter";

export default function OpenGovVoteActionsPopup({ setShowVoteActions }) {
  const { search, searchBtn, searchBar } = useVoteSearch();

  return (
    <DropdownFilterProvider defaultFilterValues={defaultVoteActionFilterValues}>
      <BaseVotesPopup
        title="Actions"
        onClose={() => setShowVoteActions(false)}
        className="!w-[960px] max-sm:w-full"
        extra={
          <div className="flex items-center gap-2">
            <VoteActionsFilter />
            {searchBtn}
          </div>
        }
      >
        {searchBar}
        <VoteActionsTable search={search} />
      </BaseVotesPopup>
    </DropdownFilterProvider>
  );
}
