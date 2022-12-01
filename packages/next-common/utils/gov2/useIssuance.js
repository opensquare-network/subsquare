import { useEffect } from "react";
import useApi from "../hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { useTimelineData } from "../../context/post";
import { gov2State } from "../consts/state";
import { latestHeightSelector } from "../../store/reducers/chainSlice";
import {
  fetchIssuanceForGov2,
  gov2IssuanceSelector,
} from "../../store/reducers/gov2ReferendumSlice";

export default function useIssuance() {
  const api = useApi();
  const dispatch = useDispatch();
  const latestHeight = useSelector(latestHeightSelector);

  const timeline = useTimelineData();
  const finishItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Rejected,
      gov2State.TimedOut,
      gov2State.Cancelled,
      gov2State.Killed,
      "Confirmed",
    ].includes(item.name)
  );
  const height = finishItem?.indexer?.blockHeight;
  const issuance = useSelector(gov2IssuanceSelector);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!issuance) {
      dispatch(fetchIssuanceForGov2(api, height));
    }

    if (!height && latestHeight % 10 === 0) {
      dispatch(fetchIssuanceForGov2(api));
    }
  }, [height, api, latestHeight, issuance]);

  return {
    issuance,
  };
}
