import { useEffect, useState } from "react";
import useSubStorage from "../common/useSubStorage";

export const InitIdentityInfo = {
  display: null,
  legal: null,
  email: null,
  matrix: null,
  web: null,
  twitter: null,
  github: null,
  discord: null,
};

export const InitIdentityJudgements = [];

export function useIdentityOf(api, address) {
  const { result, loading: isLoading } = useSubStorage(
    "identity",
    "identityOf",
    [address],
  );

  const [identity, setIdentity] = useState({
    info: InitIdentityInfo,
    judgements: InitIdentityJudgements,
  });

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    async function fetchIdentity() {
      if (!result || result.isNone) {
        try {
          // Subscription may have data returned as isNone. Here, to avoid errors, we need to get the data again.
          const apiResult = await api.query?.identity.identityOf(address);
          if (apiResult && !apiResult.isNone) {
            setIdentity(convertIdentity(apiResult));
          } else {
            setIdentity({
              info: InitIdentityInfo,
              judgements: InitIdentityJudgements,
            });
          }
        } catch (error) {
          console.error(error);
          setIdentity({
            info: InitIdentityInfo,
            judgements: InitIdentityJudgements,
          });
        }
      } else {
        setIdentity(convertIdentity(result));
      }
    }

    fetchIdentity();
  }, [address, api, result]);

  return {
    ...identity,
    isLoading,
  };
}

export function convertIdentityInfo(identityOf) {
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

export function convertIdentity(identity) {
  const unwrapped = identity.unwrap();
  const identityOf = Array.isArray(unwrapped) ? unwrapped[0] : unwrapped;

  const identityInfo = convertIdentityInfo(identityOf);
  const judgements = convertJudgements(identityOf);

  return {
    info: identityInfo,
    judgements,
  };
}

export function extractRaw(field) {
  if (!field || field === "None") {
    return null;
  }

  return field?.Raw || field || null;
}

export function convertJudgements(identityOf) {
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
