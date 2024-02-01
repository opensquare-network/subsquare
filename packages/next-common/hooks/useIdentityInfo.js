import { useEffect, useState } from "react";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import { fetchIdentity } from "next-common/services/identity";
import getChainSettings from "next-common/utils/consts/settings";

export function useChainIdentityInfo(chain, address) {
  const settings = getChainSettings(chain);
  const [identity, setIdentity] = useState(null);

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

export default function useIdentityInfo(address) {
  const chain = useChain();
  return useChainIdentityInfo(chain, address);
}
