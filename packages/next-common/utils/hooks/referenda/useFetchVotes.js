import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVotes } from "next-common/store/reducers/democracy/votes";
import { votesTriggerSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useFetchVotes(referendum) {
  const referendumIndex = referendum?.referendumIndex;
  const api = useConditionalContextApi();
  const voterTriggerCount = useSelector(votesTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(fetchVotes(api, referendumIndex));
    }
  }, [api, dispatch, referendumIndex, voterTriggerCount]);
}
