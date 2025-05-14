import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { getBalanceInfo } from "./useSubBalanceInfo";

export function useAccountBalanceInfo(address) {
  const api = useContextApi();
  const existentialDeposit = useQueryExistentialDeposit();
  const { value, loaded } = useCall(api?.query.system?.account, [address]);
  const loading = !loaded;
  const info = value?.data?.toJSON();
  return getBalanceInfo(info, existentialDeposit, loading);
}
