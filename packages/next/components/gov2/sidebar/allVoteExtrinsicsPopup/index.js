import React, { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, {
  tabs,
} from "next-common/components/democracy/allVotesPopup/tab";
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
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  const votes = tabIndex === tabs[0].tabId ? allAye : allNay;

  const onPageChange = (e, target) => {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else {
      setNayPage(target);
    }
  };

  const pagination = {
    page: tabIndex === "Aye" ? ayePage : nayPage,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <Popup title="Vote Extrinsics" onClose={() => setShowVoteList(false)}>
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
