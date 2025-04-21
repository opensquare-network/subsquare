import { useMemo } from "react";
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

export default function useSubMyIdentityInfo() {
  const address = useRealAddress();
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
    isLoading,
    result: identity,
  };
}
