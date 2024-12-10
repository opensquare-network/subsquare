import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import useSubStorage from "../common/useSubStorage";
import calcTransferable from "next-common/utils/account/transferable";
import bigAdd from "next-common/utils/math/bigAdd";

export function useSubBalanceInfo(address) {
  const existentialDeposit = useQueryExistentialDeposit();

  const { result, loading } = useSubStorage("system", "account", [address]);
  const info = result?.data?.toJSON();

  if (!info) {
    return {
      value: null,
      loading,
    };
  }

  const { free, reserved } = info;
  const balance = bigAdd(free, reserved) || 0;
  const transferrable = calcTransferable(info, existentialDeposit);

  return {
    value: {
      balance,
      transferrable,
    },
    loading,
  };
}
