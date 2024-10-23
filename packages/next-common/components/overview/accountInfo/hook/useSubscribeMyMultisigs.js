import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigs,
  fetchMyMultisigsCount,
} from "next-common/store/reducers/multisigSlice";
import { useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import getChainSettings from "next-common/utils/consts/settings";
import { useCallback, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

export function useSubscribeMyMultisigs() {
  const chain = useChain();
  const dispatch = useDispatch();
  const realAddress = useRealAddress();

  const settings = useMemo(() => getChainSettings(chain), [chain]);

  const fetchMyMultisigsData = useCallback(() => {
    if (settings?.multisigApiPrefix && realAddress) {
      dispatch(fetchMyMultisigs(chain, realAddress));
    }
  }, [dispatch, chain, realAddress, settings]);

  useEffect(() => {
    if (settings?.multisigApiPrefix && realAddress) {
      fetchMyMultisigsData();
    }
  }, [settings, realAddress, fetchMyMultisigsData]);
}

export function useSubscribeMyActiveMultisigsCount() {
  const chain = useChain();
  const dispatch = useDispatch();
  const realAddress = useRealAddress();

  const settings = useMemo(() => getChainSettings(chain), [chain]);
  const pathname = usePathname();

  const isAccountMultisigPage = pathname.startsWith("/account/multisigs");

  useEffect(() => {
    if (settings?.multisigApiPrefix && realAddress) {
      dispatch(fetchMyMultisigsCount(chain, realAddress));
    }
  }, [dispatch, chain, realAddress, settings, isAccountMultisigPage]);
}
