import { useState, memo } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import { useSelector } from "react-redux";
import {
  fellowshipVotesSelector,
  isLoadingFellowshipVotesSelector,
} from "next-common/store/reducers/fellowship/votes";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { orderBy } from "lodash-es";

const AllVotesPopup = dynamicPopup(() => import("./allVotesPopup"));

function AllVotes() {
  const [showAllVotes, setShowAllVotes] = useState(false);
  const { allAye, allNay } = useSelector(fellowshipVotesSelector);
  const isLoadingVotes = useSelector(isLoadingFellowshipVotesSelector);

  return (
    <>
      <Button onClick={() => setShowAllVotes(true)}>All Votes</Button>
      {showAllVotes && (
        <AllVotesPopup
          setShowVoteList={setShowAllVotes}
          allAye={orderBy(allAye, ["votes"], ["desc"])}
          allNay={orderBy(allNay, ["votes"], ["desc"])}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </>
  );
}

export default memo(AllVotes);
