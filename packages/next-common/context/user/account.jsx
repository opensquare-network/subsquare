import { useSubAccount } from "next-common/hooks/account/useSubAccount";
import {
  extractAccountInfo,
  extractKintsugiAccountInfo,
} from "next-common/utils/account/extractAccountInfo";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";
import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import useSubKintsugiAccount from "next-common/hooks/account/useSubKintsugiAccount";
import { useChain } from "../chain";
import { isKintsugiChain } from "next-common/utils/chain";

const Context = createContext();

export default function UserAccountProvider({ address, children }) {
  const chain = useChain();

  const Provider = isKintsugiChain(chain)
    ? KintsugiAccountProvider
    : AccountProvider;

  return <Provider address={address}>{children}</Provider>;
}

function AccountProvider({ address, children }) {
  const data = useSubAccount(address);
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

function KintsugiAccountProvider({ address, children }) {
  const data = useSubKintsugiAccount(address);
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export function useUserAccount() {
  return useContext(Context);
}

export function useUserAccountInfo() {
  const chain = useChain();
  const existentialDeposit = useSelector(existentialDepositSelector);
  const data = useUserAccount();

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
