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

const InitIdentityJudgements = [];

const extractRaw = (field) => {
  if (!field || field === "None") {
    return null;
  }

  return field?.Raw || field || null;
};

function convertJudgements(identityOf) {
  const judgements = identityOf?.judgements?.toHuman() || [];
  if (!judgements || judgements.length === 0) {
    return [];
  }

  return judgements?.map((judgement) => {
    const [index, statusField] = judgement;
    const isFeePaid =
      typeof statusField === "object" &&
      Object.entries(statusField)?.[0]?.[0] === "FeePaid";
    const status = isFeePaid ? "FeePaid" : statusField;
    const fee = isFeePaid ? Object.entries(statusField)?.[0]?.[1] : null;

    return {
      index,
      status,
      fee,
    };
  });
}

function convertIdentityInfo(identityOf) {
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

function convertIdentity(identity) {
  const unwrapped = identity.unwrap();
  const identityOf = Array.isArray(unwrapped) ? unwrapped[0] : unwrapped;

  const identityInfo = convertIdentityInfo(identityOf);
  const judgements = convertJudgements(identityOf);

  return {
    info: identityInfo,
    judgements,
  };
}

function useSuperOfIdentityDisplayName(identity) {
  const address = useRealAddress();
  const api = useContextApi();
  const [subDisplay, setSubDisplay] = useState(null);

  useEffect(() => {
    if (!api || !identity || identity?.display || !address) {
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
            const result = convertIdentity(parentResult);
            return result?.info || InitIdentityInfo;
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
      return {
        info: InitIdentityInfo,
        judgements: InitIdentityJudgements,
      };
    }

    return convertIdentity(result);
  }, [result]);

  return {
    ...identity,
    isLoading,
  };
}

export default function useSubMyIdentityInfo() {
  const address = useRealAddress();
  const { info, judgements, isLoading } = useAddressIdentityInfo(address);
  const { result: superResult } = useSuperOfIdentityDisplayName(info);

  return {
    isLoading,
    info,
    judgements,
    displayName: (info?.display || superResult) ?? null,
  };
}
