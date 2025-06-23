import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import VoteActionsTable from "./table";
import { useState } from "react";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import SearchBar from "next-common/components/voteSearch/searchBar";

export default function OpenGovVoteActionsPopup({ setShowVoteActions }) {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const searchBtn = (
    <SearchBtn
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      setSearch={setSearch}
    />
  );

  return (
    <BaseVotesPopup
      title="Actions"
      onClose={() => setShowVoteActions(false)}
      className="!w-[960px] max-sm:w-full"
      extra={searchBtn}
    >
      {showSearch && <SearchBar setSearch={setSearch} />}
      <PopupListWrapper>
        <VoteActionsTable search={search} />
      </PopupListWrapper>
    </BaseVotesPopup>
  );
}
