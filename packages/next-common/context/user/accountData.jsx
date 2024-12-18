import { useSubAccountData } from "next-common/hooks/account/useSubAccountData";
import {
  extractAccountInfo,
  extractKintsugiAccountInfo,
} from "next-common/utils/account/extractAccountInfo";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";
import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import useSubKintsugiAccountData from "next-common/hooks/account/useSubKintsugiAccountData";
import { useChain } from "../chain";
import { isKintsugiChain } from "next-common/utils/chain";

const Context = createContext();

export default function UserAccountDataProvider({ address, children }) {
  const chain = useChain();

  const AccountProvider = isKintsugiChain(chain)
    ? KintsugiAccountDataProvider
    : AccountDataProvider;

  return <AccountProvider address={address}>{children}</AccountProvider>;
}

function AccountDataProvider({ address, children }) {
  const data = useSubAccountData(address);
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

function KintsugiAccountDataProvider({ address, children }) {
  const data = useSubKintsugiAccountData(address);
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export function useUserAccountData() {
  return useContext(Context);
}

export function useUserAccountInfo() {
  const chain = useChain();
  const existentialDeposit = useSelector(existentialDepositSelector);
  const data = useUserAccountData();

  const info = useMemo(() => {
    if (!data?.data) {
      return null;
    }

    const extractFn = isKintsugiChain(chain)
      ? extractKintsugiAccountInfo
      : extractAccountInfo;

    return extractFn(data?.data, existentialDeposit);
  }, [chain, data, existentialDeposit]);

  return { info, isLoading: data?.isLoading };
}
