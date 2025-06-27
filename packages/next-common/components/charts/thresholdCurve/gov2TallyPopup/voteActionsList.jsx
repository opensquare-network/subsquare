import { memo } from "react";
import VoteActionsTable from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table";
import useVoteSearch from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/useVoteSearch";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { cn } from "next-common/utils";

function VoteActionsList() {
  const { search, searchBtn, searchBar, showSearch } = useVoteSearch();

  return (
    <div>
      <div className="w-full flex justify-between">
        <TitleContainer
          className={cn("!px-0 text14Bold", !showSearch && "mb-4")}
        >
          Actions
        </TitleContainer>
        {searchBtn}
      </div>
      {searchBar}
      <VoteActionsTable search={search} listHeight={300} />
    </div>
  );
}

export default memo(VoteActionsList);
