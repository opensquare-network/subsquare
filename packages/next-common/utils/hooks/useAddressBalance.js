import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useChain, useSymbol } from "../../context/chain";
import { isKintsugiChain } from "../chain";
import useConditionalSubStorage from "next-common/hooks/common/useConditionalSubStorage";

export async function querySystemAccountBalance(api, address) {
  const account = await api.query.system.account(address);
  return new BigNumber(account.data.free.toJSON())
    .plus(account.data.reserved.toJSON())
    .toString();
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

  const { result, loading } = useConditionalSubStorage(
    pallet,
    storage,
    params,
    { api },
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
