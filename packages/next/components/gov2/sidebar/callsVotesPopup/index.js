import React, { useState } from "react";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import {
  isLoadingVoteExtrinsicsSelector,
  voteExtrinsicsSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import Pagination from "next-common/components/pagination";
import CallsVotesList from "./callsVotesList";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";

export default function CallsVotesPopup({ setShowVoteList }) {
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(voteExtrinsicsSelector);
  const isLoading = useSelector(isLoadingVoteExtrinsicsSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);
  const [abstainPage, setAbstainPage] = useState(1);
  const pageSize = 50;

  const onPageChange = (e, target) => {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else if (tabIndex === "Nay") {
      setNayPage(target);
    } else if (tabIndex === "Abstain") {
      setAbstainPage(target);
    }
  };

  let votes = [];
  let page = 1;
  if (tabIndex === "Aye") {
    votes = allAye;
    page = ayePage;
  } else if (tabIndex === "Nay") {
    votes = allNay;
    page = nayPage;
  } else if (tabIndex === "Abstain") {
    votes = allAbstain;
    page = abstainPage;
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
    <BaseVotesPopup wide title="Calls" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
        abstainCount={allAbstain?.length || 0}
      />
      <CallsVotesList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoading}
      />
      <Pagination {...pagination} />
    </BaseVotesPopup>
  );
}
