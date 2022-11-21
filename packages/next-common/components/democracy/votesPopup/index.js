import React, { useState } from "react";
import Popup from "../../popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "../../../store/reducers/referendumSlice";
import VotersList from "./votesList";
import Pagination from "next-common/components/pagination";

export default function VotesPopup({ setShowVoteList }) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const loading = useSelector(isLoadingVotesSelector);
  const [ayePage, setAyePage] = useState(1);
  const [nayPage, setNayPage] = useState(1);

  const pageSize = 50;

  const votes = tabIndex === tabs[0].tabId ? allAye : allNay;

  const pagination = {
    page: tabIndex === "Aye" ? ayePage : nayPage,
    pageSize,
    total: votes?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Aye") {
      setAyePage(target);
    } else {
      setNayPage(target);
    }
  }

  return (
    <Popup title="Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <VotersList items={votes.slice(sliceFrom, sliceTo)} loading={loading} />

      <Pagination {...pagination} />
    </Popup>
  );
}
