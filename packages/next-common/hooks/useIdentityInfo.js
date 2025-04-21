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

export function useChainAddressIdentityInfo(chain, address) {
  const { identity: identityChain } = getChainSettings(chain);

  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, identityChain);
  const cachedIdentity = getCachedIdentity(identityChain, encodedAddress);
  const [identity, setIdentity] = useState(cachedIdentity);
  const [isLoading, setIsLoading] = useState(true);
  const { result: myIdentityInfo, isLoading: isMyIdentityLoading } =
    useSubMyIdentityInfo();

  useEffect(() => {
    setIdentity(null);
    if (address) {
      setIsLoading(true);
      fetchIdentity(identityChain, encodeAddressToChain(address, identityChain))
        .then((identity) => {
          if (!isPeopleChain(chain)) {
            setIdentity(identity);
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
          } else if (isNil(peopleIdentityName) && !isNil(peopleIdentity)) {
            peopleIdentity = null;
          }

          setIdentity(peopleIdentity);
        })
        .finally(() => setIsLoading(false));
    }
  }, [address, identityChain, myIdentityInfo, isMyIdentityLoading, chain]);

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
