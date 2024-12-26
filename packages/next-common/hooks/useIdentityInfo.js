import { useEffect, useState } from "react";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import {
  fetchIdentity,
  getCachedIdentity,
} from "next-common/services/identity";
import getChainSettings from "next-common/utils/consts/settings";

export function useChainAddressIdentityInfo(chain, address) {
  const { identity: identityChain } = getChainSettings(chain);
  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, identityChain);
  const cachedIdentity = getCachedIdentity(identityChain, encodedAddress);
  const [identity, setIdentity] = useState(cachedIdentity);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIdentity(null);
    if (address) {
      setIsLoading(true);
      fetchIdentity(identityChain, encodeAddressToChain(address, identityChain))
        .then((identity) => setIdentity(identity))
        .finally(() => setIsLoading(false));
    }
  }, [address, identityChain]);

  return {
    identity,
    hasIdentity: identity && identity?.info?.status !== "NO_ID",
    isLoading,
  };
}

export default function useIdentityInfo(address) {
  const chain = useChain();
  return useChainAddressIdentityInfo(chain, address);
}
