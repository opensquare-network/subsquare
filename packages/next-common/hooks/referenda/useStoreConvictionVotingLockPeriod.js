import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setConvictionVotingLockPeriod } from "next-common/store/reducers/chainSlice";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export default function useStoreConvictionVotingLockPeriod() {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { hasReferenda } = useChainSettings();

  useEffect(() => {
    if (api && api.consts?.convictionVoting && hasReferenda) {
      dispatch(
        setConvictionVotingLockPeriod(
          api.consts.convictionVoting.voteLockingPeriod.toNumber(),
        ),
      );
    }
  }, [api, dispatch, hasReferenda]);
}
