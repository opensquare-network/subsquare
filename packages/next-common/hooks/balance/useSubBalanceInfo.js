import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import calcTransferable from "next-common/utils/account/transferable";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";

export function useSubBalanceInfo(address, specApi = null) {
  const existentialDeposit = useQueryExistentialDeposit();
  const conditionalApi = useConditionalContextApi();

  const api = specApi || conditionalApi;

  const [balance, loading, resultJsonInfo] = useAddressBalance(api, address);

  if (!balance || !resultJsonInfo) {
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
