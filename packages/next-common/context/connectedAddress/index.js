import { CACHE_KEY } from "next-common/utils/constants";
import { createContext, useContext, useEffect, useReducer } from "react";
import getStorageAddressInfo from "next-common/utils/getStorageAddressInfo";

const ConnectedAddressContext = createContext(null);

export default ConnectedAddressContext;

const ACTION_KEY = {
  SET: "SET",
  FORGET: "FORGET",
};

function connectedAddressReducer(state, action) {
  switch (action.type) {
    case ACTION_KEY.SET:
      localStorage.setItem(
        CACHE_KEY.lastConnectedAddress,
        JSON.stringify(action.info),
      );
      return action.info;
    case ACTION_KEY.FORGET:
      localStorage.removeItem(CACHE_KEY.lastConnectedAddress);
      return null;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function ConnectedAddressProvider({ children }) {
  const [connectedAddress, dispatch] = useReducer(connectedAddressReducer);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = getStorageAddressInfo(CACHE_KEY.lastConnectedAddress);
      if (!info) {
        return;
      }
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
