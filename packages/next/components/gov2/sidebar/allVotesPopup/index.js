import React, { useEffect, useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";
import VotersList from "next-common/components/democracy/votesPopup/votesList";
import { useSelector } from "react-redux";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import Pagination from "next-common/components/pagination";

export default function AllVotesPopup({ setShowVoteList }) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const isLoading = useSelector(isLoadingVotesSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const votes = tabIndex === tabs[0].tabId ? allAye : allNay;

  const onPageChange = (e, target) => {
    e.preventDefault();
    setPage(target);
  };

  const pagination = {
    page,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <Popup title="All Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <VotersList items={votes.slice(sliceFrom, sliceTo)} loading={isLoading} />
      <Pagination {...pagination} />
    </Popup>
  );
}
