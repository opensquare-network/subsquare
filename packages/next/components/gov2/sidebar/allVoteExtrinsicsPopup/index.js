import React, { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import {
  isLoadingVoteExtrinsicsSelector,
  voteExtrinsicsSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import Pagination from "next-common/components/pagination";
import VoteExtrinsicList from "./voteExtrinsicList";

export default function AllVoteExtrinsicsPopup({ setShowVoteList }) {
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

  let votes = [];
  if (tabIndex === "Aye") {
    votes = allAye;
  } else if (tabIndex === "Nay") {
    votes = allNay;
  } else if (tabIndex === "Abstain") {
    votes = allAbstain;
  }

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

  let page = 1;
  if (tabIndex === "Aye") {
    page = ayePage;
  } else if (tabIndex === "Nay") {
    page = nayPage;
  } else if (tabIndex === "Abstain") {
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
    <Popup title="Vote Extrinsics" onClose={() => setShowVoteList(false)}>
      <VotesTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        ayesCount={allAye?.length || 0}
        naysCount={allNay?.length || 0}
        abstainCount={allAbstain?.length || 0}
      />
      <VoteExtrinsicList
        items={votes.slice(sliceFrom, sliceTo)}
        loading={isLoading}
      />
      <Pagination {...pagination} />
    </Popup>
  );
}
