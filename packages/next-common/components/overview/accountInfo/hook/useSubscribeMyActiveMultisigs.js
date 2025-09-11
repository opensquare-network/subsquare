import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigs,
  fetchMyMultisigsCount,
} from "next-common/store/reducers/multisigSlice";
import { useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { useChainSettings } from "next-common/context/chain";

export default function useSubscribeMyActiveMultisigs(isAccountMultisigPage) {
  const chain = useChain();
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const chainSettings = useChainSettings();

  useEffect(() => {
    if (
      isAccountMultisigPage ||
      !chainSettings?.multisigApiPrefix ||
      !chain ||
      !realAddress
    ) {
      return;
    }

    dispatch(fetchMyMultisigs(chain, realAddress));
    dispatch(fetchMyMultisigsCount(chain, realAddress));
  }, [dispatch, chain, realAddress, chainSettings, isAccountMultisigPage]);
}
