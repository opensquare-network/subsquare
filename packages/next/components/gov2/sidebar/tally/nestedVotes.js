import { useMemo, useState } from "react";
import { Button } from "./styled";
import { sortTotalVotes } from "next-common/utils/democracy/votes/passed/common";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useReferendaVotes } from "next-common/utils/gov2/useVotesFromServer";
import { useOnchainData } from "next-common/context/post";

const NestedVotesPopup = dynamicPopup(() => import("./nestedVotesPopup"));

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);
  const { referendumIndex } = useOnchainData();
  const { nestedVotes, showVotesNum } = useReferendaVotes(referendumIndex);

  const { allAye = [], allNay = [], allAbstain = [] } = nestedVotes;

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
