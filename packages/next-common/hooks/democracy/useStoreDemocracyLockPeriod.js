import { useDispatch } from "react-redux";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect } from "react";
import { setDemocracyLockPeriod } from "next-common/store/reducers/chainSlice";

export default function useStoreDemocracyLockPeriod() {
  const dispatch = useDispatch();
  const api = useApi();

  useEffect(() => {
    if (api && api.consts?.democracy) {
      dispatch(
        setDemocracyLockPeriod(
          api.consts.democracy.voteLockingPeriod.toNumber(),
        ),
      );
    }
  }, [api, dispatch]);
}
