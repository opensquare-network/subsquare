import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import {
  fetchIdentity,
  getCachedIdentity,
} from "next-common/services/identity";

export default function useIdentityInfo(address) {
  const settings = useChainSettings();
  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, settings.identity);
  const cachedIdentity = getCachedIdentity(settings.identity, encodedAddress);
  const [identity, setIdentity] = useState(cachedIdentity);

  useEffect(() => {
    setIdentity(null);
    if (address) {
      fetchIdentity(
        settings.identity,
        encodeAddressToChain(address, settings.identity),
      ).then((identity) => setIdentity(identity));
    }
  }, [address, settings]);

  return [identity, identity && identity?.info?.status !== "NO_ID"];
}
