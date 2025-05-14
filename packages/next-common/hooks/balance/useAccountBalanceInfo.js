import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import calcTransferable from "next-common/utils/account/transferable";
import bigAdd from "next-common/utils/math/bigAdd";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

export function useAccountBalanceInfo(address) {
  const api = useContextApi();
  const existentialDeposit = useQueryExistentialDeposit();
  const { value, loaded } = useCall(api?.query.system?.account, [address]);
  const loading = !loaded;

  const info = value?.data?.toJSON();
  if (!info) {
    return {
      value: null,
      loading,
    };
  }

  const { free, reserved } = info || {};
  const balance = bigAdd(free, reserved) || 0;
  const transferrable = calcTransferable(info, existentialDeposit);

  return {
    value: { balance, transferrable },
    loading,
  };
}
