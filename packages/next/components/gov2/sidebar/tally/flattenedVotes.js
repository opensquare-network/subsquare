import { useState } from "react";
import { Button } from "./styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  useReferendaFlattenVotes,
  useReferendaShowVotesNum,
} from "next-common/utils/gov2/useVotesFromServer";
import { useOnchainData } from "next-common/context/post";

const FlattenedVotesPopup = dynamicPopup(() => import("./flattenedVotesPopup"));

export default function FlattenedVotes() {
  const [showFlattenedVotes, setShowFlattenedVotes] = useState(false);
  const { referendumIndex } = useOnchainData();
  const showVotesNum = useReferendaShowVotesNum(referendumIndex);
  const { allAye, allNay, allAbstain } =
    useReferendaFlattenVotes(referendumIndex);

  return (
    <>
      <Button onClick={() => setShowFlattenedVotes(true)}>Flattened</Button>
      {showFlattenedVotes && (
        <FlattenedVotesPopup
          setShowVoteList={setShowFlattenedVotes}
          allAye={allAye}
          allNay={allNay}
          allAbstain={allAbstain}
          isLoadingVotes={!showVotesNum}
        />
      )}
    </>
  );
}
