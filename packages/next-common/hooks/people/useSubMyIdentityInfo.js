import { useEffect, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "next-common/hooks/common/useSubStorage";

const InitIdentityInfo = {
  display: null,
  legal: null,
  email: null,
  matrix: null,
  web: null,
  twitter: null,
  github: null,
  discord: null,
};

const extractRaw = (field) => {
  if (!field || field === "None") {
    return null;
  }

  return field?.Raw || field || null;
};

function convertIdentityInfo(identity) {
  const unwrapped = identity.unwrap();
  const identityOf = Array.isArray(unwrapped) ? unwrapped[0] : unwrapped;
  const info = identityOf?.info?.toHuman() || {};

  return {
    display: extractRaw(info?.display),
    legal: extractRaw(info?.legal),
    email: extractRaw(info?.email),
    matrix: extractRaw(info?.matrix),
    web: extractRaw(info?.web),
    twitter: extractRaw(info?.twitter),
    github: extractRaw(info?.github),
    discord: extractRaw(info?.discord),
  };
}

function useSuperOfIdentityDisplayName(identity) {
  const address = useRealAddress();
  const api = useContextApi();
  const [subDisplay, setSubDisplay] = useState(null);

  useEffect(() => {
    if (!api || !identity || identity?.display) {
      return;
    }

    async function fetchIdentityInfo() {
      const superOfResult = await api.query.identity
        ?.superOf(address)
        .then((superOf) => {
          if (superOf?.isSome) {
            const [parentAddress, subDisplay] =
              superOf.unwrap()?.toHuman() || [];
            return {
              subDisplay: subDisplay?.Raw,
              parentAddress,
            };
          }
        });

      if (superOfResult?.isNone || !superOfResult?.parentAddress) {
        return;
      }

      const identityResult = await api.query.identity
        ?.identityOf(superOfResult.parentAddress)
        .then((parentResult) => {
          if (!parentResult?.isNone) {
            return convertIdentityInfo(parentResult);
          }
        });
      if (identityResult.display && superOfResult.subDisplay) {
        setSubDisplay(`${identityResult.display}/${superOfResult.subDisplay}`);
      }
    }

    try {
      fetchIdentityInfo();
    } catch (error) {
      console.error(error);
    }
  }, [api, identity, address]);

  return {
    result: subDisplay,
    isLoading: false,
  };
}

function useAddressIdentityInfo(address) {
  const { result, loading: isLoading } = useSubStorage(
    "identity",
    "identityOf",
    [address],
  );

  const identity = useMemo(() => {
    if (!result || result?.isNone) {
      return InitIdentityInfo;
    }

    return convertIdentityInfo(result);
  }, [result]);

  return {
    result: identity,
    isLoading,
  };
}

export default function useSubMyIdentityInfo() {
  const address = useRealAddress();
  const { result, isLoading } = useAddressIdentityInfo(address);
  const { result: superResult } = useSuperOfIdentityDisplayName(result);

  return {
    isLoading,
    result: result,
    displayName: (result.display || superResult) ?? null,
  };
}
