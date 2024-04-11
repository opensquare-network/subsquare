import React, { useCallback, useContext, useEffect, useState } from "react";
import { SignetSdk } from "@talismn/signet-apps-sdk";
import { useAsync } from "react-use";

const SignetContext = React.createContext();

export default SignetContext;

let signetSdk = null;

export function SignetContextProvider({ children }) {
  const [sdk, setSdk] = useState();
  useEffect(() => {
    signetSdk = new SignetSdk();
    setSdk(signetSdk);
  }, []);

  const { value: inSignet, loading } = useAsync(
    async () => sdk && sdk.init(),
    [sdk],
  );

  return (
    <SignetContext.Provider value={{ inSignet, loading, sdk }}>
      {children}
    </SignetContext.Provider>
  );
}

export function useSignetSdk() {
  return useContext(SignetContext);
}

export function useSignetVault() {
  const { sdk, inSignet } = useSignetSdk();
  const [injectedVault, setInjectedVault] = useState();

  const getVault = useCallback(async () => {
    const vault = await sdk.getAccount();
    setInjectedVault(vault);
  }, []);

  useEffect(() => {
    if (inSignet) getVault();
  }, [inSignet, getVault]);

  return injectedVault;
}

export function getSignetSdk() {
  return signetSdk;
}
