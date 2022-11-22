import React, { useState } from "react";
import Popup from "../../popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";
import VotersList from "./votesList";
import Pagination from "next-common/components/pagination";

export default function VotesPopup({
  setShowVoteList,
  allAye,
  allNay,
  isLoadingVotes,
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const pageSize = 50;

  const votes = tabIndex === tabs[0].tabId ? allAye : allNay;

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else {
      setNayPage(target);
    }
  }

  const pagination = {
    page: tabIndex === "Aye" ? ayePage : nayPage,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <Popup title="All Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
      />
      <VotersList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoadingVotes}
      />
      <Pagination {...pagination} />
    </Popup>
  );
}
