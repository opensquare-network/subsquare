import { useEffect } from "react";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { fetchProfileMultisigsCount } from "next-common/store/reducers/profile/multisig";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useChain } from "next-common/context/chain";
import { useDispatch } from "react-redux";

export default function useFetchProfileData() {
  const chain = useChain();
  const address = useProfileAddress();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPolkadotAddress(address)) {
      return;
    }

    dispatch(fetchProfileMultisigsCount(chain, address));
  }, [dispatch, chain, address]);
}
