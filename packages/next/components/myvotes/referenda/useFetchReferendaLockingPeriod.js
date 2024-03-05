import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setReferendaLockingPeriod } from "next-common/store/reducers/referenda/meta";
import { useContextApi } from "next-common/context/api";

export default function useFetchReferendaLockingPeriod() {
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(
        setReferendaLockingPeriod(
          api.consts?.convictionVoting?.voteLockingPeriod.toNumber(),
        ),
      );
    }
  }, [api, dispatch]);
}
