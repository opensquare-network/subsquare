import { useState, useEffect, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { hexToString } from "@polkadot/util";
import { convertIdentity } from "../identity/useIdentityOf";

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
const getSubIdentityName = async (api, address) => {
  if (!api?.query?.identity?.superOf) {
    return "";
  }
  const identity = await api.query.identity
    .identityOf(address)
    .then((res) => res.toJSON());
  if (identity?.info?.display?.raw) {
    return identity.info.display.Raw;
  }
  const superOf = await api?.query?.identity?.superOf(address);
  const subName = superOf.unwrap()?.[1];
  return subName.toJSON().raw;
};

const getSubIdentity = async (subsMap, address, api) => {
  const subAddresses = subsMap[address]?.[1] || [];
  if (subAddresses.length === 0) {
    return [];
  }
  const subIdentityPromises = subAddresses.map(async (subAddress) => {
    const nameRaw = await getSubIdentityName(api, subAddress);
    const name = nameRaw ? hexToString(nameRaw) : nameRaw;
    return { address: subAddress, name };
  });

  return await Promise.all(subIdentityPromises);
};

export default function useOnchainPeopleIdentityList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const api = useContextApi();
  const { value, loaded } = useCall(
    api?.query?.identity?.identityOf?.entries,
    [],
  );
  const { value: subEntries, loaded: subMapLoaded } = useCall(
    api?.query?.identity?.subsOf?.entries,
    [],
  );

  const getIdentityData = useCallback(async () => {
    const subsMap = subEntries.reduce((result, [key, subsOf]) => {
      const address = getAddressFromStorageKey(key);
      result[address] = subsOf.toJSON();
      return result;
    }, {});

    const results = (
      await Promise.all(
        (value || []).map(async ([storageKey, storageValue]) => {
          if (isDepositZero(storageValue)) {
            return null;
          }

          const address = storageKey?.args[0]?.toString();
          const status = matchJudgementStatus(storageValue);
          const storageData = convertIdentity(storageValue);

          return {
            address,
            name: storageData.info.display.raw || "",
            ...storageData,
            status,
            subIdentities: await getSubIdentity(subsMap, address, api),
          };
        }),
      )
    )
      ?.filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));

    setData(results);
    setIsLoading(false);
  }, [api, subEntries, value]);

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
