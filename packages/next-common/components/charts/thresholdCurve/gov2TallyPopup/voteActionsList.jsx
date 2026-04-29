import { memo } from "react";
import VoteActionsTable from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table";
import useVoteSearch from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/useVoteSearch";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { cn } from "next-common/utils";
import { DropdownFilterProvider } from "next-common/components/dropdownFilter/context";
import VoteActionsFilter from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/voteActionsFilter";
import { defaultVoteActionFilterValues } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/useVoteActionsFilter";

function VoteActionsListContent() {
  const { search, searchBtn, searchBar, showSearch } = useVoteSearch();

  return (
    <div>
      <div className="w-full flex justify-between">
        <TitleContainer
          className={cn("!px-0 text14Bold", !showSearch && "mb-4")}
        >
          Actions
        </TitleContainer>
        <div className="flex items-center gap-2">
          <VoteActionsFilter />
          {searchBtn}
        </div>
      </div>
      {searchBar}
      <VoteActionsTable search={search} listHeight={300} />
    </div>
  );
}

function VoteActionsList() {
  return (
    <DropdownFilterProvider defaultFilterValues={defaultVoteActionFilterValues}>
      <VoteActionsListContent />
    </DropdownFilterProvider>
  );
}

export default memo(VoteActionsList);
