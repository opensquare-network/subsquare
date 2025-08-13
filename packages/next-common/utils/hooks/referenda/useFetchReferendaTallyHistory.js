import { backendApi } from "next-common/services/nextApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearTallyHistory,
  setTallyHistory,
} from "next-common/store/reducers/referenda/tallyHistory";

export default function useFetchReferendaTallyHistory(
  referendumIndex,
  autoClear = false,
) {
  const dispatch = useDispatch();

  useEffect(() => {
    backendApi
      .fetch(`gov2/referenda/${referendumIndex}/tally-history`)
      .then(({ result }) => {
        if (!result) return;
        dispatch(setTallyHistory(result));
      });

    return () => {
      autoClear && dispatch(clearTallyHistory());
    };
  }, [autoClear, dispatch, referendumIndex]);
}
