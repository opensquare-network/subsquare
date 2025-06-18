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

const emptyIdentityInfo = {};

export function useChainAddressIdentityInfo(chain, address, realAddress = "") {
  const { identity: identityChain } = getChainSettings(chain);

  const { displayName, info: myIdentityInfo = emptyIdentityInfo } =
    useIdentityInfoContext() || {};

  // Render the identity immediately if it's already in cache
  const encodedAddress = encodeAddressToChain(address, identityChain);
  const cachedIdentity = getCachedIdentity(identityChain, encodedAddress);
  const [identity, setIdentity] = useState(cachedIdentity);
  const [isLoading, setIsLoading] = useState(true);
  const [rpcIdentity, setRpcIdentity] = useState(null);
  const [apiIdentity, setApiIdentity] = useState(null);

  const isNeedRpcIdentity = useMemo(() => {
    return isPeopleChain(chain) && isSameAddress(realAddress, address);
  }, [chain, realAddress, address]);

  useEffect(() => {
    if (!apiIdentity || !isNeedRpcIdentity) {
      return;
    }
    const myIdentityIsEmpty = Object.values(myIdentityInfo).every((item) =>
      isNil(item),
    );
    if (myIdentityIsEmpty && !displayName) {
      setRpcIdentity(null);
      return;
    }

    let peopleIdentity = cloneDeep(apiIdentity);
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

    setRpcIdentity(peopleIdentity);
  }, [myIdentityInfo, displayName, apiIdentity, isNeedRpcIdentity]);

  useEffect(() => {
    setApiIdentity(null);
    if (address) {
      setIsLoading(true);
      fetchIdentity(identityChain, encodeAddressToChain(address, identityChain))
        .then((identity) => {
          setApiIdentity(identity);
        })
        .finally(() => setIsLoading(false));
    }
  }, [address, identityChain]);

  useEffect(() => {
    if (isNeedRpcIdentity) {
      setIdentity(rpcIdentity);
      return;
    }

    setIdentity(apiIdentity);
  }, [apiIdentity, rpcIdentity, isNeedRpcIdentity]);

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
