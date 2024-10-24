import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const RelayInfoContext = createContext({});

export default function RelayInfoProvider({ children }) {
  const height = useSelector(chainOrScanHeightSelector);

  return (
    <RelayInfoContext.Provider
      value={{
        height,
      }}
    >
      {children}
    </RelayInfoContext.Provider>
  );
}

export function useRelayHeight() {
  const { height } = useContext(RelayInfoContext);
  return height;
}
