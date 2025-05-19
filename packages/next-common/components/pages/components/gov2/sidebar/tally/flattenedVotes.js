import { useState } from "react";
import { Button } from "./styled";
import { useSelector } from "react-redux";
import {
  flattenVotesSelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

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
      <Tooltip
        contentClassName="max-w-[240px]"
        content="Displays all individual votes equally, no grouping."
      >
        <Button onClick={() => setShowFlattenedVotes(true)}>Flattened</Button>
      </Tooltip>
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
