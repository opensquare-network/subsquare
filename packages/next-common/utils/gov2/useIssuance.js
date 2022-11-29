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
import { latestHeightSelector } from "../../store/reducers/chainSlice";

export default function useIssuance() {
  const api = useApi();
  const dispatch = useDispatch();
  const latestHeight = useSelector(latestHeightSelector);

  const timeline = useTimelineData();
  const finishItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Rejected,
      gov2State.Timeout,
      gov2State.Cancelled,
      gov2State.Killed,
      "Confirmed",
    ].includes(item.name)
  );
  const height = finishItem?.indexer?.blockHeight;

  const issuance = useSelector(electorateSelector);
  const isLoading = useSelector(isLoadingElectorateSelector);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!issuance || latestHeight % 10 === 0) {
      dispatch(fetchElectorate(api, height));
    }
  }, [height, api, latestHeight, issuance]);

  return {
    issuance,
    isLoading,
  };
}
