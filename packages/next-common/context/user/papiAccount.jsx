import { usePapiAccount } from "next-common/hooks/account/usePapiAccount";
import usePapiKintsugiAccount from "next-common/hooks/account/usePapiKintsugiAccount";
import {
  extractPapiAccountInfo,
  extractPapiKintsugiAccountInfo,
} from "next-common/utils/account/extractPapiAccountInfo";
import { isKintsugiChain } from "next-common/utils/chain";
import usePapiQueryExistentialDeposit from "next-common/utils/hooks/chain/usePapiQueryExistentialDeposit";
import { useContext, useMemo } from "react";
import { useChain } from "../chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Context } from "./context";

export default function UserPapiAccountProvider({ children, address = "" }) {
  const chain = useChain();
  const connectedAddress = useRealAddress();
  const realAddress = address || connectedAddress;

  if (!realAddress) {
    return (
      <Context.Provider value={{ info: null, isLoading: false }}>
        {children}
      </Context.Provider>
    );
  }

  if (isKintsugiChain(chain)) {
    return (
      <KintsugiPapiAccountProvider address={realAddress}>
        {children}
      </KintsugiPapiAccountProvider>
    );
  }

  return (
    <PapiAccountProvider address={realAddress}>{children}</PapiAccountProvider>
  );
}

function PapiAccountProvider({ address, children }) {
  const { data, isLoading } = usePapiAccount(address);
  const existentialDeposit = usePapiQueryExistentialDeposit();
  const info = useMemo(() => {
    if (!data) {
      return null;
    }
    return extractPapiAccountInfo(data, existentialDeposit);
  }, [data, existentialDeposit]);
  return (
    <Context.Provider value={{ isLoading, info }}>{children}</Context.Provider>
  );
}

function KintsugiPapiAccountProvider({ address, children }) {
  const { data, isLoading } = usePapiKintsugiAccount(address);
  const existentialDeposit = usePapiQueryExistentialDeposit();
  const info = useMemo(() => {
    if (!data) {
      return null;
    }
    return extractPapiKintsugiAccountInfo(data, existentialDeposit);
  }, [data, existentialDeposit]);
  return (
    <Context.Provider value={{ isLoading, info }}>{children}</Context.Provider>
  );
}

export function useUserAccountInfo() {
  return useContext(Context);
}
