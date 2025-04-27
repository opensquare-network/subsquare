import { useEffect, useState } from "react";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import {
  fetchIdentity,
  getCachedIdentity,
} from "next-common/services/identity";
import getChainSettings from "next-common/utils/consts/settings";
import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import { isPeopleChain } from "next-common/utils/chain";
import { cloneDeep } from "lodash-es";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";

export function useChainAddressIdentityInfo(chain, address) {
  const { identity: identityChain } = getChainSettings(chain);

  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, identityChain);
  const cachedIdentity = getCachedIdentity(identityChain, encodedAddress);
  const [identity, setIdentity] = useState(cachedIdentity);
  const [isLoading, setIsLoading] = useState(true);
  const { info: myIdentityInfo } = useSubMyIdentityInfo();
  const realAddress = useRealAddress();

  useEffect(() => {
    setIdentity(null);
    if (address) {
      setIsLoading(true);
      fetchIdentity(identityChain, encodeAddressToChain(address, identityChain))
        .then((identity) => {
          if (!isPeopleChain(chain) || !isSameAddress(realAddress, address)) {
            setIdentity(identity);
            return;
          }

          const myIdentityIsEmpty = Object.values(myIdentityInfo).every(
            (item) => isNil(item),
          );
          if (myIdentityIsEmpty && !displayName) {
            setIdentity(null);
            return;
          }

          let peopleIdentity = cloneDeep(identity);
          const peopleIdentityName = myIdentityInfo?.display;
          if (peopleIdentity?.info && peopleIdentity?.info?.display) {
            peopleIdentity.info.display = peopleIdentityName;
          } else if (isNil(peopleIdentity) && peopleIdentityName) {
            peopleIdentity = {
              info: {
                display: peopleIdentityName,
                status: "NOT_VERIFIED",
              },
            };
          }

          if (
            !peopleIdentity?.info?.display &&
            displayName &&
            peopleIdentity?.info
          ) {
            peopleIdentity.info.display = displayName;
          }

          setIdentity(peopleIdentity);
        })
        .finally(() => setIsLoading(false));
    }
  }, [address, identityChain, myIdentityInfo, displayName, chain, realAddress]);

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
