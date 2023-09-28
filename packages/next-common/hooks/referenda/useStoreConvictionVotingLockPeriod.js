import { useDispatch } from "react-redux";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect } from "react";
import { setConvictionVotingLockPeriod } from "next-common/store/reducers/chainSlice";
import { useChainSettings } from "next-common/context/chain";

export default function useStoreConvictionVotingLockPeriod() {
  const dispatch = useDispatch();
  const api = useApi();
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
