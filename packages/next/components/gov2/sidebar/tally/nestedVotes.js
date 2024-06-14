import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "./styled";
import { sortTotalVotes } from "next-common/utils/democracy/votes/passed/common";
import {
  nestedVotesSelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import dynamic from "next/dynamic";

const NestedVotesPopup = dynamic(() => import("./nestedVotesPopup"), {
  ssr: false,
});

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);
  const showVotesNum = useSelector(showVotesNumberSelector);

  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(nestedVotesSelector);

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
          isLoadingVotes={!showVotesNum}
        />
      )}
    </>
  );
}
