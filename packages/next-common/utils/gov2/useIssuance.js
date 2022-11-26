import { useEffect } from "react";
import useApi from "../hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import {
  electorateSelector,
  fetchElectorate,
  isLoadingElectorateSelector,
} from "../../store/reducers/referendumSlice";

export default function useIssuance(height) {
  const api = useApi();
  const dispatch = useDispatch();

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
