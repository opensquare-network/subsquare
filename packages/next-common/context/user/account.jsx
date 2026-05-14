import { useSubAccount } from "next-common/hooks/account/useSubAccount";
import useSubKintsugiAccount from "next-common/hooks/account/useSubKintsugiAccount";
import {
  extractAccountInfo,
  extractKintsugiAccountInfo,
} from "next-common/utils/account/extractAccountInfo";
import { isKintsugiChain } from "next-common/utils/chain";
import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import { createContext, useContext, useMemo } from "react";
import { useChain } from "../chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const Context = createContext();

export default function UserAccountProvider({ children, address = "" }) {
  const chain = useChain();
  const connectedAddress = useRealAddress();
  const realAddress = address || connectedAddress;

  if (!realAddress) {
    return (
      <Context.Provider value={{ data: null, isLoading: false }}>
        {children}
      </Context.Provider>
    );
  }

  if (isKintsugiChain(chain)) {
    return (
      <KintsugiAccountProvider address={realAddress}>
        {children}
      </KintsugiAccountProvider>
    );
  }

  return <AccountProvider address={realAddress}>{children}</AccountProvider>;
}

function AccountProvider({ address, children }) {
  const data = useSubAccount(address);
  const existentialDeposit = useQueryExistentialDeposit();
  const info = useMemo(() => {
    if (!data?.data) {
      return null;
    }
    return extractAccountInfo(data?.data, existentialDeposit);
  }, [data, existentialDeposit]);
  return (
    <Context.Provider value={{ ...data, info }}>{children}</Context.Provider>
  );
}

function KintsugiAccountProvider({ address, children }) {
  const data = useSubKintsugiAccount(address);
  const existentialDeposit = useQueryExistentialDeposit();
  const info = useMemo(() => {
    if (!data?.data) {
      return null;
    }
    return extractKintsugiAccountInfo(data?.data, existentialDeposit);
  }, [data, existentialDeposit]);
  return (
    <Context.Provider value={{ ...data, info }}>{children}</Context.Provider>
  );
}

export function useUserAccount() {
  return useContext(Context);
}

export function useUserAccountInfo() {
  const data = useUserAccount();
  return { info: data?.info, isLoading: data?.isLoading };
}
