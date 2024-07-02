import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";
import {
  ambassadorSalaryClaimantsTriggerSelector,
  fetchAmbassadorSalaryClaimants,
} from "next-common/store/reducers/ambassador/claimants";
import { useDispatch, useSelector } from "react-redux";

export default function useFetchAmbassadorSalaryClaimants() {
  const api = useContextApi();
  const triggerUpdate = useSelector(ambassadorSalaryClaimantsTriggerSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    dispatch(fetchAmbassadorSalaryClaimants(api));
  }, [api, triggerUpdate]);
}
