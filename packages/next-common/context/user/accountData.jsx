import { useSubAccountData } from "next-common/hooks/account/useSubAccountData";
import { extractAccountInfo } from "next-common/hooks/useAccountInfo";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";
import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";

const Context = createContext();

export default function UserAccountDataProvider({ address, children }) {
  const data = useSubAccountData(address);

  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export function useUserAccountData() {
  return useContext(Context);
}

export function useUserAccountInfo() {
  const existentialDeposit = useSelector(existentialDepositSelector);
  const data = useUserAccountData();

  const info = useMemo(() => {
    if (!data?.data) {
      return null;
    }
    return extractAccountInfo(data?.data, existentialDeposit);
  }, [data?.data, existentialDeposit]);

  return { info, isLoading: data?.isLoading };
}
