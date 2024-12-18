import { useMemo } from "react";
import useOnChainAccountData from "./useOnChainAccountData";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { extractAccountInfo } from "next-common/utils/account/extractAccountInfo";

export default function useAccountInfo(address) {
  const accountData = useOnChainAccountData(address);
  const existentialDeposit = useSelector(existentialDepositSelector);
  return useMemo(() => {
    if (!accountData) {
      return null;
    }
    return extractAccountInfo(accountData, existentialDeposit);
  }, [accountData, existentialDeposit]);
}
