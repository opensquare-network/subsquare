import { CACHE_KEY } from "next-common/utils/constants";
import ChainTypes from "next-common/utils/consts/chainTypes";
import getChainSettings from "next-common/utils/consts/settings";
import { createContext, useContext, useEffect, useReducer } from "react";
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

const ACTION_KEY = {
  SET: "SET",
  FORGET: "FORGET",
};

function connectedAddressReducer(state, action) {
  switch (action.type) {
    case ACTION_KEY.SET:
      setStorageLastConnectedAddress(action.info);
      return action.info;
    case ACTION_KEY.FORGET:
      forgetStorageLastConnectedAddress();
      return null;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function ConnectedAddressProvider({ children }) {
  const [connectedAddress, dispatch] = useReducer(connectedAddressReducer);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = getStorageLastConnectedAddress();
      dispatch({
        type: ACTION_KEY.SET,
        info,
      });
    }
  }, []);

  return (
    <ConnectedAddressContext.Provider
      value={{
        connectedAddress,
        dispatch,
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

export function useConnectedAddressDispatch() {
  const { dispatch } = useContext(ConnectedAddressContext);
  return dispatch;
}

export function setConnectedAddress(dispatch, info) {
  if (!info) {
    dispatch({
      type: ACTION_KEY.FORGET,
    });
    return;
  }

  dispatch({
    type: ACTION_KEY.SET,
    info,
  });
}

export function disconnectAddress(dispatch) {
  dispatch({
    type: ACTION_KEY.FORGET,
  });
}
