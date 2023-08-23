import { detailMultiTabsVotesStatsView } from "next-common/store/reducers/detailSlice";
import {
  allNestedVotesSelector,
  flattenVotesSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VotesStats from "../../charts/votesStats";

export default function Gov2ReferendaVotesStats() {
  const allFlattenedVotes = useSelector(flattenVotesSelector);
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const [votesObj, setVotesObj] = useState({});
  const viewMode = useSelector(detailMultiTabsVotesStatsView);

  useEffect(() => {
    if (viewMode === "flattened") {
      setVotesObj(allFlattenedVotes);
    } else {
      setVotesObj(allNestedVotes);
    }
  }, [viewMode]);

  return (
    <VotesStats
      allAye={votesObj.allAye}
      allNay={votesObj.allNay}
      allAbstain={votesObj.allAbstain}
    />
  );
}
