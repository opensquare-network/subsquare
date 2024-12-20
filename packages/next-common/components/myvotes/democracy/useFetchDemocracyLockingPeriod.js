import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDemocracyLockingPeriod } from "next-common/store/reducers/democracy/info";
import { useContextApi } from "next-common/context/api";

export default function useFetchDemocracyLockingPeriod() {
  const api = useContextApi();
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
