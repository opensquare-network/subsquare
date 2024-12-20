import BigNumber from "bignumber.js";
import { useChain, useSymbol } from "../../context/chain";
import { isKintsugiChain } from "../chain";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export async function querySystemAccountBalance(api, address) {
  const account = await api.query.system.account(address);
  return new BigNumber(account.data.free.toJSON())
    .plus(account.data.reserved.toJSON())
    .toString();
}

export default function useAddressBalance(api, address) {
  const chain = useChain();
  const symbol = useSymbol();

  let pallet;
  let storage;
  let params;
  if (isKintsugiChain(chain)) {
    pallet = "tokens";
    storage = "accounts";
    params = [address, { token: symbol }];
  } else {
    pallet = "system";
    storage = "account";
    params = [address];
  }

  const { result, loading } = useSubStorage(pallet, storage, params, { api });

  let balance = 0;
  if (isKintsugiChain(chain)) {
    balance = new BigNumber(result?.free?.toJSON() || 0)
      .plus(result?.reserved?.toJSON() || 0)
      .toString();
  } else {
    balance = new BigNumber(result?.data?.free?.toJSON() || 0)
      .plus(result?.data?.reserved?.toJSON() || 0)
      .toString();
  }

  return [balance, loading];
}
