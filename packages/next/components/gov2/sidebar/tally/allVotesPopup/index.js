import React, { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";
import VotersList from "next-common/components/democracy/allVotesPopup/votesList";
import Pagination from "next-common/components/pagination";

export default function VotesPopup({
  setShowVoteList,
  allAye,
  allNay,
  allAbstain,
  isLoadingVotes,
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const [abstainPage, setAbstainPage] = useState(1);
  const pageSize = 50;

  let page = 1;
  let votes = [];
  if (tabIndex === "Aye") {
    page = ayePage;
    votes = allAye;
  } else if (tabIndex === "Nay") {
    page = nayPage;
    votes = allNay;
  } else {
    page = abstainPage;
    votes = allAbstain;
  }

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else if (tabIndex === "Nay") {
      setNayPage(target);
    } else {
      setAbstainPage(target);
    }
  }

  const pagination = {
    page,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <Popup wide title="All Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
        abstainsCount={allAbstain?.length || 0}
      />
      <VotersList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoadingVotes}
        tab={tabIndex}
        isOpenGov={true}
      />
      <Pagination {...pagination} />
    </Popup>
  );
}
