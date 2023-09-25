import { CACHE_KEY } from "next-common/utils/constants";
import ChainTypes from "next-common/utils/consts/chainTypes";
import getChainSettings from "next-common/utils/consts/settings";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ethers from "ethers";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";

const ConnectedAddressContext = createContext(null);

export default ConnectedAddressContext;

export function getStorageLastConnectedAddress() {
  const lastConnectedAddress = localStorage.getItem(
    CACHE_KEY.lastConnectedAddress,
  );
  if (!lastConnectedAddress) {
    return;
  }
  try {
    const info = JSON.parse(lastConnectedAddress);

    // Check data
    const chain = process.env.NEXT_PUBLIC_CHAIN;
    const chainSettings = getChainSettings(chain);

    if (
      chainSettings.chainType === ChainTypes.ETHEREUM &&
      !ethers.isAddress(info.address)
    ) {
      return;
    }

    if (!isPolkadotAddress(info.address)) {
      return;
    }

    return info;
  } catch (e) {
    return;
  }
}

function setStorageLastConnectedAddress(info) {
  localStorage.setItem(CACHE_KEY.lastConnectedAddress, JSON.stringify(info));
}

function forgetStorageLastConnectedAddress() {
  localStorage.removeItem(CACHE_KEY.lastConnectedAddress);
}

export function ConnectedAddressProvider({ children }) {
  const [connectedAddress, setConnectedAddress] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = getStorageLastConnectedAddress();
      setConnectedAddress(info);
    }
  }, []);

  return (
    <ConnectedAddressContext.Provider
      value={{
        connectedAddress,
        setConnectedAddress,
      }}
    >
      {children}
    </ConnectedAddressContext.Provider>
  );
}

export function useConnectedAddress() {
  const { connectedAddress } = useContext(ConnectedAddressContext);
  return connectedAddress;
}

export function useSetConnectedAddress() {
  const { setConnectedAddress } = useContext(ConnectedAddressContext);
  return useCallback(
    (info) => {
      if (!info) {
        setConnectedAddress();
        forgetStorageLastConnectedAddress();
        return;
      }

      setConnectedAddress(info);
      setStorageLastConnectedAddress(info);
    },
    [setConnectedAddress],
  );
}

export function useDisconnectAddress() {
  const setConnectedAddress = useSetConnectedAddress();
  return useCallback(() => setConnectedAddress(), [setConnectedAddress]);
}
