import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";
import {
  fellowshipSalaryClaimantsTriggerSelector,
  fetchFellowshipSalaryClaimants,
} from "next-common/store/reducers/fellowship/claimants";
import { useDispatch, useSelector } from "react-redux";

export default function useFetchFellowshipSalaryClaimants() {
  const api = useContextApi();
  const triggerUpdate = useSelector(fellowshipSalaryClaimantsTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    dispatch(fetchFellowshipSalaryClaimants(api));
  }, [api, triggerUpdate]);
}
