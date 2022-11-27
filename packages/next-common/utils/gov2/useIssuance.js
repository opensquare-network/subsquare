import { useEffect } from "react";
import useApi from "../hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import {
  electorateSelector,
  fetchElectorate,
  isLoadingElectorateSelector,
} from "../../store/reducers/referendumSlice";
import { useTimelineData } from "../../context/post";
import { gov2State } from "../consts/state";

export default function useIssuance() {
  const api = useApi();
  const dispatch = useDispatch();

  const timeline = useTimelineData();
  const finishItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Rejected,
      gov2State.Timeout,
      gov2State.Cancelled,
      gov2State.Killed,
    ].includes(item.name)
  );
  const height = finishItem?.indexer?.blockHeight;

  const issuance = useSelector(electorateSelector);
  const isLoading = useSelector(isLoadingElectorateSelector);

  useEffect(() => {
    if (api) {
      dispatch(fetchElectorate(api, height));
    }
  }, [height, api]);

  return {
    issuance,
    isLoading,
  };
}
