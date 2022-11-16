import React, { useEffect, useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import VotesTab, {
  tabs,
} from "next-common/components/democracy/votesPopup/tab";
import VotersList from "next-common/components/democracy/votesPopup/votesList";
import { useSelector } from "react-redux";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/referendumSlice";

export default function AllVotesPopup({ setShowVoteList }) {
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const isLoading = useSelector(isLoadingVotesSelector);
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);

  return (
    <Popup title="All Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <VotersList
        items={tabIndex === tabs[0].tabId ? allAye : allNay}
        loading={isLoading}
      />
    </Popup>
  );
}
