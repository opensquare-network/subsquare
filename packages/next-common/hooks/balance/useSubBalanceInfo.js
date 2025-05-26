import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import calcTransferable from "next-common/utils/account/transferable";
import { useContextApi } from "next-common/context/api";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";

export function useSubBalanceInfo(address) {
  const existentialDeposit = useQueryExistentialDeposit();
  const api = useContextApi();

  const [balance, loading, resultJsonInfo] = useAddressBalance(api, address);

  if (!resultJsonInfo) {
    return {
      value: null,
      loading,
    };
  }
  const transferrable = calcTransferable(resultJsonInfo, existentialDeposit);

  return {
    value: {
      balance,
      transferrable,
    },
    loading,
  };
}
