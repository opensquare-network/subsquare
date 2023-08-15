import useApi from "next-common/utils/hooks/useApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDemocracyLockingPeriod } from "next-common/store/reducers/democracy/info";

export default function useFetchDemocracyLockingPeriod() {
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(
        setDemocracyLockingPeriod(
          api.consts?.democracy?.voteLockingPeriod.toNumber(),
        ),
      );
    }
  }, [api, dispatch]);
}
