import SubLink from "next-common/components/styled/subLink";
import { useState } from "react";
import dynamic from "next/dynamic";

const CheckAllVotesPopup = dynamic(
  () => import("components/democracy/allVotesPopup"),
  {
    ssr: false,
  },
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
