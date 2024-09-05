import nextApi from "next-common/services/nextApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearTallyHistory,
  setTallyHistory,
} from "next-common/store/reducers/referenda/tallyHistory";

export default function useFetchReferendaTallyHistory(referendumIndex) {
  const dispatch = useDispatch();

  useEffect(() => {
    nextApi
      .fetch(`gov2/referenda/${referendumIndex}/tally-history`)
      .then(({ result }) => {
        if (!result) return;
        dispatch(setTallyHistory(result));
      });

    return () => {
      dispatch(clearTallyHistory());
    };
  }, [dispatch, referendumIndex]);
}
