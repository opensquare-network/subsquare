import { useMemo, useState } from "react";
import { Button } from "./styled";
import { sortTotalVotes } from "next-common/utils/democracy/votes/passed/common";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  useReferendaNestedVotes,
  useReferendaShowVotesNum,
} from "next-common/utils/gov2/useVotesFromServer";
import { useOnchainData } from "next-common/context/post";

const NestedVotesPopup = dynamicPopup(() => import("./nestedVotesPopup"));

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);
  const { referendumIndex } = useOnchainData();
  const showVotesNum = useReferendaShowVotesNum(referendumIndex);
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useReferendaNestedVotes(referendumIndex);

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
