import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import NestedVotesPopup from "./nestedVotesPopup";
import { Button } from "./styled";
import { sortTotalVotes } from "next-common/utils/democracy/votes/passed/common";

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(votesSelector);
  const directAyes = allAye.filter(v => !v.isDelegating);
  sortTotalVotes(directAyes);
  const directNays = allNay.filter(v => !v.isDelegating);
  sortTotalVotes(directNays);

  return (
    <>
      <Button onClick={() => setShowNestedVotes(true)}>Nested</Button>

      {showNestedVotes && (
        <NestedVotesPopup
          allAye={directAyes}
          allNay={directNays}
          allAbstain={allAbstain}
          setShowVoteList={setShowNestedVotes}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </>
  );
}
