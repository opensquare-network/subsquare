import BigNumber from "bignumber.js";
import { useEffect, useState, useMemo } from "react";
import { useMountedState } from "react-use";
import { useChain, useSymbol } from "../../context/chain";
import { isKintsugiChain } from "../chain";
import { isNil } from "lodash-es";

export async function querySystemAccountBalance(api, address) {
  const account = await api.query.system.account(address);
  return new BigNumber(account.data.free.toJSON())
    .plus(account.data.reserved.toJSON())
    .toString();
}

function useSubAddressBalance(pallet, storage, params = [], api) {
  const isMounted = useMountedState();
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(true);

  const filteredParams = (Array.isArray(params) ? params : [params]).filter(
    (param) => !isNil(param),
  );

  useEffect(() => {
    if (!api || isNil(pallet) || isNil(storage)) {
      return;
    }

    const queryStorage = api?.query[pallet]?.[storage];
    if (!queryStorage) {
      setResult();
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsub;

    queryStorage(...filteredParams, (subscribeResult) => {
      if (!isMounted()) {
        return;
      }

      setResult(subscribeResult);
      setLoading(false);
    })
      .then((unsubscribe) => {
        unsub = unsubscribe;
      })
      .catch((e) => {
        console.error(e);
        if (isMounted()) {
          setResult();
          setLoading(false);
        }
      });

    return () => {
      if (unsub) {
        unsub();
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, pallet, storage, isMounted, ...filteredParams]);

  return { result, loading };
}

export default function useAddressBalance(api, address) {
  const chain = useChain();
  const symbol = useSymbol();

  const { pallet, storage, params } = useMemo(() => {
    if (isKintsugiChain(chain)) {
      return {
        pallet: "tokens",
        storage: "accounts",
        params: [address, { token: symbol }],
      };
    }

    return {
      pallet: "system",
      storage: "account",
      params: [address],
    };
  }, [chain, address, symbol]);

  const { result, loading } = useSubAddressBalance(
    pallet,
    storage,
    params,
    api,
  );

  let balance = 0;
  let resultJson;
  if (isKintsugiChain(chain)) {
    balance = new BigNumber(result?.free?.toJSON() || 0)
      .plus(result?.reserved?.toJSON() || 0)
      .toString();
    resultJson = result?.toJSON();
  } else {
    balance = new BigNumber(result?.data?.free?.toJSON() || 0)
      .plus(result?.data?.reserved?.toJSON() || 0)
      .toString();
    resultJson = result?.data?.toJSON();
  }

  return [balance, loading, resultJson];
}
