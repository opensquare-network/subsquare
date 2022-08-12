import React, { useState } from "react";
import Popup from "../../popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";
import { useSelector } from "react-redux";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "../../../store/reducers/referendumSlice";
import VotersList from "./votesList";

export default function VotesPopup({ setShowVoteList, chain }) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const voters = useSelector(votesSelector);
  const loading = useSelector(isLoadingVotesSelector);

  return (
    <Popup title="Votes" onClose={() => setShowVoteList(false)}>
      <VotesTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <VotersList
        chain={chain}
        items={tabIndex === tabs[0].tabId ? voters.allAye : voters.allNay}
        loading={loading}
      />
    </Popup>
  );
}
