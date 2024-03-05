import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setDemocracyLockPeriod } from "next-common/store/reducers/chainSlice";
import { useContextApi } from "next-common/context/api";

export default function useStoreDemocracyLockPeriod() {
  const dispatch = useDispatch();
  const api = useContextApi();

  useEffect(() => {
    if (api && api.consts?.democracy?.voteLockingPeriod) {
      dispatch(
        setDemocracyLockPeriod(
          api.consts.democracy.voteLockingPeriod.toNumber(),
        ),
      );
    }
  }, [api, dispatch]);
}
