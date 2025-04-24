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

export default function useSubMyIdentityInfo() {
  const address = useRealAddress();
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
    isLoading,
    ...identity,
  };
}
