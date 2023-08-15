import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setReferendaLockingPeriod } from "next-common/store/reducers/referenda/meta";

export default function useFetchReferendaLockingPeriod() {
  const api = useApi();
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
