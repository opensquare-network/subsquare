import { useEffect, useState } from "react";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import {
  fetchIdentity,
  fetchBountyIdentity,
  getCachedIdentity,
  getCachedBountyIdentity,
} from "next-common/services/identity";
import getChainSettings from "next-common/utils/consts/settings";
import { isPeopleChain } from "next-common/utils/chain";
import { cloneDeep } from "lodash-es";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";

const emptyIdentityInfo = {};

export function useChainAddressIdentityInfo(chain, address, realAddress = "") {
  const { identity: identityChain } = getChainSettings(chain);

  const { displayName, info: myIdentityInfo = emptyIdentityInfo } =
    useIdentityInfoContext() || {};

  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, identityChain);
  const cachedIdentity = getCachedIdentity(identityChain, encodedAddress);
  const cachedBountyIdentity = getCachedBountyIdentity(chain, address);

  const initialIdentity = cachedIdentity || cachedBountyIdentity;
  const [identity, setIdentity] = useState(initialIdentity);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIdentity(null);
    if (!address) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let resolvedIdentity = null;

    fetchIdentity(identityChain, encodeAddressToChain(address, identityChain))
      .then((identity) => {
        if (!isPeopleChain(chain) || !isSameAddress(realAddress, address)) {
          resolvedIdentity = identity;
          setIdentity(identity);
          return;
        }

        const myIdentityIsEmpty = Object.values(myIdentityInfo).every((item) =>
          isNil(item),
        );
        if (myIdentityIsEmpty && !displayName) {
          resolvedIdentity = null;
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

        resolvedIdentity = peopleIdentity;
        setIdentity(peopleIdentity);
      })
      .finally(async () => {
        const hasIdentity =
          resolvedIdentity && resolvedIdentity?.info?.status !== "NO_ID";

        if (!hasIdentity) {
          try {
            const bountyIdentity = await fetchBountyIdentity(chain, address);
            if (!isNil(bountyIdentity)) {
              setIdentity(bountyIdentity);
            }
          } catch (err) {
            console.error("Failed to fetch bounty identity:", err);
          }
        }

        setIsLoading(false);
      });
  }, [address, identityChain, myIdentityInfo, displayName, chain, realAddress]);

  return {
    identity,
    hasIdentity: identity && identity?.info?.status !== "NO_ID",
    isLoading,
  };
}

export default function useIdentityInfo(address) {
  const chain = useChain();
  const realAddress = useRealAddress();
  return useChainAddressIdentityInfo(chain, address, realAddress);
}
