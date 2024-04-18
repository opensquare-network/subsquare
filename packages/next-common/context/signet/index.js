import React, { useCallback, useContext, useEffect, useState } from "react";
import { SignetSdk } from "@talismn/signet-apps-sdk";
import { useAsync } from "react-use";
import { normalizedSignetAccount } from "next-common/utils/signet";

const SignetContext = React.createContext();

export default SignetContext;

let signetSdk = null;

export function SignetContextProvider({ children }) {
  const [sdk, setSdk] = useState();
  useEffect(() => {
    signetSdk = new SignetSdk();
    setSdk(signetSdk);
  }, []);

  const { value: inSignet, loading } = useAsync(async () => {
    if (sdk) {
      return sdk.init();
    }
    return false;
  }, [sdk]);

  return (
    <SignetContext.Provider value={{ inSignet, loading, sdk }}>
      {children}
    </SignetContext.Provider>
  );
}

export function useSignetSdk() {
  return useContext(SignetContext) || {};
}

export function useSignetAccounts() {
  const { sdk, inSignet } = useSignetSdk();
  const [accounts, setAccounts] = useState([]);

  const getVault = useCallback(async () => {
    if (!sdk) {
      return;
    }
    const vault = await sdk.getAccount();
    if (!vault) {
      return;
    }

    const normalizedAccount = normalizedSignetAccount({
      ...vault,
      address: vault.vaultAddress,
    });

    setAccounts([normalizedAccount]);
  }, [sdk]);

  useEffect(() => {
    if (inSignet) {
      getVault();
    }
  }, [inSignet, getVault]);

  return accounts;
}

export function getSignetSdk() {
  return signetSdk;
}
