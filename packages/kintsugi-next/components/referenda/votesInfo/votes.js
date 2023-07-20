import SubLink from "next-common/components/styled/subLink";
import { useState } from "react";
import CheckAllVotesPopup from "components/democracy/allVotesPopup";

export default function Votes() {
  const [showVoteList, setShowVoteList] = useState(false);

  return (
    <>
      <SubLink onClick={() => setShowVoteList(true)}>Votes</SubLink>
      {showVoteList && <CheckAllVotesPopup setShowVoteList={setShowVoteList} />}
    </>
  );
}
