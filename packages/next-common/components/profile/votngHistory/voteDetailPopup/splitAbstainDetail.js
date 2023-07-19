import { useState } from "react";
import SplitAbstainVoteTabs, { Aye } from "./splitAbstainVoteTabs";

export function SplitAbstainVoteDetail() {
  const [tabIndex, setTabIndex] = useState(Aye);
  return (
    <div>
      <SplitAbstainVoteTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />
    </div>
  );
}
