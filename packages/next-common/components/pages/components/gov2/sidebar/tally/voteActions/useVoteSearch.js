import { useState } from "react";
import SearchBtn from "next-common/components/voteSearch/searchBtn";
import SearchBar from "next-common/components/voteSearch/searchBar";

export default function useVoteSearch() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const searchBtn = (
    <SearchBtn
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      setSearch={setSearch}
    />
  );

  const searchBar = showSearch ? <SearchBar setSearch={setSearch} /> : null;

  return {
    search,
    searchBtn,
    searchBar,
    showSearch,
  };
}
