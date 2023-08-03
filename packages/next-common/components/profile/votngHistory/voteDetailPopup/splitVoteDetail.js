import { useState } from "react";
import SplitVoteTabs, { Aye, Nay } from "./splitVoteTabs";
import VotesInfoGroup from "next-common/components/popup/nestedVotesPopup/votesInfoGroup";

export function SplitVoteDetail({ vote }) {
  const [tabIndex, setTabIndex] = useState(Aye);

  let data = {};

  if (tabIndex === Aye) {
    data = {
      ...vote,
      votes: vote.ayeVotes,
      balance: vote.ayeBalance,
    };
  } else if (tabIndex === Nay) {
    data = {
      ...vote,
      votes: vote.nayVotes,
      balance: vote.nayBalance,
    };
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <SplitVoteTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <VotesInfoGroup data={data} />
    </div>
  );
}
