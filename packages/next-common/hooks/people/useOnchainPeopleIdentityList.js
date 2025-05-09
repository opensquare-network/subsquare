import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

function matchJudgementStatus(storageValue) {
  const unwrappedValue = storageValue?.unwrap() || {};
  const { judgements } = Array.isArray(unwrappedValue)
    ? unwrappedValue[0]
    : unwrappedValue;

  if (judgements?.length >= 1) {
    if (
      judgements?.toString()?.includes("knownGood") ||
      judgements?.toString()?.includes("reasonable")
    ) {
      return "verified";
    } else if (
      judgements?.toString()?.includes("erroneous") ||
      judgements?.toString()?.includes("lowQuality") ||
      judgements?.toString()?.includes("unknown") ||
      judgements?.toString()?.includes("outOfDate")
    ) {
      return "erroneous";
    } else {
      return "unverified";
    }
  } else {
    return "unverified";
  }
}

function isDepositZero(storageValue) {
  const jsonValue = storageValue?.toJSON() || [];
  const deposit = Array.isArray(jsonValue)
    ? jsonValue[0]?.deposit
    : jsonValue?.deposit;

  return deposit === 0;
}

export default function useOnchainPeopleIdentityList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const api = useContextApi();
  const { value, loaded } = useCall(
    api?.query?.identity?.identityOf?.entries,
    [],
  );

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const results = (value || [])
      .map(([storageKey, storageValue]) => {
        if (isDepositZero(storageValue)) {
          return null;
        }

        const address = storageKey?.args[0]?.toString();
        const status = matchJudgementStatus(storageValue);

        return {
          address,
          ...storageValue?.toJSON(),
          status,
        };
      })
      ?.filter(Boolean);

    setData(results);
    setIsLoading(false);
  }, [loaded, value]);

  return {
    isLoading,
    data,
  };
}
