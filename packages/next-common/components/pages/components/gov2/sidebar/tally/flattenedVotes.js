import { useState } from "react";
import { Button } from "./styled";
import { useSelector } from "react-redux";
import {
  flattenVotesSelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FlattenedVotesPopup = dynamicPopup(() => import("./flattenedVotesPopup"));

export default function FlattenedVotes() {
  const [showFlattenedVotes, setShowFlattenedVotes] = useState(false);
  const showVotesNum = useSelector(showVotesNumberSelector);
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(flattenVotesSelector);

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
