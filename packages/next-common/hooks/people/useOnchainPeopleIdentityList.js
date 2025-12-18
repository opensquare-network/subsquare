import { useState, useEffect, useCallback } from "react";
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
function getAddressFromStorageKey(storageKey) {
  if (storageKey.args[0]) {
    return storageKey.args[0].toString();
  }
}
const getSubIdentity = (subsMap, address) => {
  return (subsMap[address]?.[1] || []).map((address) => {
    return {
      address,
    };
  });
};

export default function useOnchainPeopleIdentityList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const api = useContextApi();
  const { value, loaded } = useCall(
    api?.query?.identity?.identityOf?.entries,
    [],
  );
  const { value: subEntries, loaded: subMapLoaded } = useCall(
    api?.query?.identity?.subsOf?.entries,
    [],
  );

  const getIdentityData = useCallback(() => {
    const subsMap = subEntries.reduce((result, [key, subsOf]) => {
      const address = getAddressFromStorageKey(key);
      result[address] = subsOf.toJSON();
      return result;
    }, {});

    const results = (value || [])
      .map(([storageKey, storageValue]) => {
        if (isDepositZero(storageValue)) {
          return null;
        }

        const address = storageKey?.args[0]?.toString();
        const status = matchJudgementStatus(storageValue);

        return {
          address,
          ...storageValue?.toHuman(),
          status,
          subIdentities: getSubIdentity(subsMap, address),
        };
      })
      ?.filter(Boolean);

    setData(results);
    setIsLoading(false);
  }, [subEntries, value]);

  useEffect(() => {
    if (!loaded || !subMapLoaded) {
      return;
    }
    getIdentityData();
  }, [getIdentityData, loaded, subMapLoaded]);

  return {
    isLoading,
    data,
  };
}
