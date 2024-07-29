import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import {
  fetchIdentity,
  getCachedIdentity,
} from "next-common/services/identity";

export default function useIdentityInfo(address) {
  const { identity: identityChain } = useChainSettings();
  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, identityChain);
  const cachedIdentity = getCachedIdentity(identityChain, encodedAddress);
  const [identity, setIdentity] = useState(cachedIdentity);

  useEffect(() => {
    setIdentity(null);
    if (address) {
      fetchIdentity(
        identityChain,
        encodeAddressToChain(address, identityChain),
      ).then((identity) => setIdentity(identity));
    }
  }, [address, identityChain]);

  return [identity, identity && identity?.info?.status !== "NO_ID"];
}
