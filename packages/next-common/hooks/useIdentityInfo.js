import { useEffect, useMemo, useState } from "react";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";
import {
  fetchIdentity,
  getCachedIdentity,
} from "next-common/services/identity";
import getChainSettings from "next-common/utils/consts/settings";
import { isPeopleChain } from "next-common/utils/chain";
import { cloneDeep } from "lodash-es";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";

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
      fetchIdentity(identityChain, encodeAddressToChain(address, identityChain))
        .then((identity) => {
          setIdentity(identity);
        })
        .finally(() => setIsLoading(false));
    }
  }, [address, identityChain]);

  return formatIdentityInfo(identity, isLoading);
}

const emptyIdentityInfo = {};

export function usePeopleIdentityInfo(identity) {
  const [peopleIdentity, setPeopleIdentity] = useState(null);

  const { displayName, info: myIdentityInfo = emptyIdentityInfo } =
    useIdentityInfoContext() || {};

  useEffect(() => {
    if (!identity) {
      return;
    }
    const myIdentityIsEmpty = Object.values(myIdentityInfo).every((item) =>
      isNil(item),
    );
    if (myIdentityIsEmpty && !displayName) {
      setPeopleIdentity(null);
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

    if (!peopleIdentity?.info?.display && displayName && peopleIdentity?.info) {
      peopleIdentity.info.display = displayName;
    }

    setPeopleIdentity(peopleIdentity);
  }, [myIdentityInfo, displayName, identity, setPeopleIdentity]);

  return formatIdentityInfo(peopleIdentity);
}

export default function useIdentityInfo(address) {
  const chain = useChain();
  const realAddress = useRealAddress();

  const isNeedPeopleIdentity = useMemo(() => {
    return isPeopleChain(chain) && isSameAddress(realAddress, address);
  }, [chain, realAddress, address]);

  const identityInfo = useChainAddressIdentityInfo(chain, address);
  const peopleIdentityInfo = usePeopleIdentityInfo(
    isNeedPeopleIdentity ? identityInfo.identity : null,
  );

  if (isNeedPeopleIdentity) {
    return peopleIdentityInfo;
  }

  return identityInfo;
}

function formatIdentityInfo(identity = null, isLoading = false) {
  return {
    identity,
    hasIdentity: identity && identity?.info?.status !== "NO_ID",
    isLoading,
  };
}
