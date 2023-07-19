import { useState } from "react";
import SplitAbstainVoteTabs, {
  Abstain,
  Aye,
  Nay,
} from "./splitAbstainVoteTabs";
import VotesInfoGroup from "next-common/components/popup/nestedVotesPopup/votesInfoGroup";

export function SplitAbstainVoteDetail({ vote }) {
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
  } else if (tabIndex === Abstain) {
    data = {
      ...vote,
      votes: vote.abstainVotes,
      balance: vote.abstainBalance,
    };
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <SplitAbstainVoteTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <VotesInfoGroup data={data} />
    </div>
  );
}
