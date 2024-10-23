import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigs,
  fetchMyMultisigsCount,
} from "next-common/store/reducers/multisigSlice";
import { useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import getChainSettings from "next-common/utils/consts/settings";
import { useEffect, useMemo } from "react";

export default function useSubscribeMyActiveMultisigs(isAccountMultisigPage) {
  const chain = useChain();
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const settings = useMemo(() => getChainSettings(chain), [chain]);

  useEffect(() => {
    if (isAccountMultisigPage) {
      return;
    }

    if (settings?.multisigApiPrefix && realAddress) {
      dispatch(fetchMyMultisigs(chain, realAddress));
      dispatch(fetchMyMultisigsCount(chain, realAddress));
    }
  }, [dispatch, chain, realAddress, settings, isAccountMultisigPage]);
}
