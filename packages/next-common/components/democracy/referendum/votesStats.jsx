import { detailMultiTabsVotesStatsView } from "next-common/store/reducers/detailSlice";
import {
  allNestedVotesSelector,
  flattenVotesSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VotesStats from "../../charts/votesStats";

export default function DemocracyRefernedaVotesStats() {
  const allFlattenedVotes = useSelector(flattenVotesSelector);
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const [votesObj, setVotesObj] = useState({});
  const [sizeField, setSizeField] = useState("votes");
  const viewMode = useSelector(detailMultiTabsVotesStatsView);

  useEffect(() => {
    if (viewMode === "flattened") {
      setVotesObj(allFlattenedVotes);
      setSizeField("votes");
    } else {
      setVotesObj(allNestedVotes);
      setSizeField("totalVotes");
    }
  }, [viewMode]);

  return (
    <VotesStats
      allAye={votesObj.allAye}
      allNay={votesObj.allNay}
      allAbstain={votesObj.allAbstain}
      sizeField={sizeField}
    />
  );
}
