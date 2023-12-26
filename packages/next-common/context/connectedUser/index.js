import { createContext, useContext, useEffect, useState } from "react";
import { useConnectedWalletContext } from "../connectedWallet";
import nextApi from "next-common/services/nextApi";

const ConnectedUserContext = createContext(null);

export default ConnectedUserContext;

export function ConnectedUserProvider({
  connectedUser: _connectedUser,
  children,
}) {
  const [connectedUser, setConnectedUser] = useState(_connectedUser);
  const { connectedWallet } = useConnectedWalletContext();

  useEffect(() => {
    if (connectedWallet?.address === connectedUser?.address) {
      return;
    }
    setConnectedUser(null);
    nextApi
      .fetch(`users/${connectedWallet?.address}/public-info`)
      .then(({ result }) => {
        if (result) {
          setConnectedUser(result);
        }
      });
  }, [connectedUser?.address, connectedWallet?.address]);

  return (
    <ConnectedUserContext.Provider
      value={{
        connectedUser,
      }}
    >
      {children}
    </ConnectedUserContext.Provider>
  );
}

export function useConnectedUser() {
  const context = useContext(ConnectedUserContext);
  if (context === undefined) {
    throw new Error(
      "useConnectedUser must be used within a ConnectedUserProvider",
    );
  }

  const { connectedUser } = context;
  return connectedUser;
}
