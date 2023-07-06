import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import NestedVotesPopup from "./nestedVotesPopup";
import { Button } from "./styled";
import { sortTotalVotes } from "next-common/utils/democracy/votes/passed/common";
import { allNestedVotesSelector, isLoadingVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);

  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(allNestedVotesSelector);

  const directAyes = useMemo(
    () => sortTotalVotes(allAye.filter((v) => !v.isDelegating)),
    [allAye],
  );
  const directNays = useMemo(
    () => sortTotalVotes(allNay.filter((v) => !v.isDelegating)),
    [allNay],
  );

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
