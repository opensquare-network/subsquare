import SubLink from "next-common/components/styled/subLink";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const CheckAllVotesPopup = dynamicPopup(() =>
  import("components/democracy/allVotesPopup"),
);

export default function Votes() {
  const [showVoteList, setShowVoteList] = useState(false);

  return (
    <>
      <SubLink onClick={() => setShowVoteList(true)}>Votes</SubLink>
      {showVoteList && <CheckAllVotesPopup setShowVoteList={setShowVoteList} />}
    </>
  );
}
