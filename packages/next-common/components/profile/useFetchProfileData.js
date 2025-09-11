import { useEffect } from "react";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { fetchProfileMultisigsCount } from "next-common/store/reducers/profile/multisig";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useChain, useChainSettings } from "next-common/context/chain";
import { useDispatch } from "react-redux";
import useFetchProfileDepositsData from "next-common/hooks/profile/deposit";

export default function useFetchProfileData() {
  const chain = useChain();
  const { hasMultisig } = useChainSettings();
  const address = useProfileAddress();
  const dispatch = useDispatch();
  useFetchProfileDepositsData();

  useEffect(() => {
    if (!isPolkadotAddress(address) || !hasMultisig) {
      return;
    }

    dispatch(fetchProfileMultisigsCount(chain, address));
  }, [dispatch, chain, address, hasMultisig]);
}
