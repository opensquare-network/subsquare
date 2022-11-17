import React, { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, { tabs } from "../tab";
import { useSelector } from "react-redux";
import {
  isLoadingVoteExtrinsicsSelector,
  voteExtrinsicsSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import Pagination from "next-common/components/pagination";
import VoteExtrinsicList from "./voteExtrinsicList";

export default function AllVoteExtrinsicsPopup({ setShowVoteList }) {
  const { allAye = [], allNay = [] } = useSelector(voteExtrinsicsSelector);
  const isLoading = useSelector(isLoadingVoteExtrinsicsSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [page, setPage] = useState(1);
  const pageSize = 5;

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
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
      />
      <VoteExtrinsicList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoading}
      />
      <Pagination {...pagination} />
    </Popup>
  );
}
