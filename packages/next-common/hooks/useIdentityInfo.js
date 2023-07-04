import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import { fetchIdentity } from "next-common/services/identity";

export default function useIdentityInfo(address) {
  const settings = useChainSettings();
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
