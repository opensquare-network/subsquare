import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

export const SubspaceContext = createContext({});

export default function RelayInfoProvider({ children }) {
  const height = useSelector(chainOrScanHeightSelector);

  return (
    <SubspaceContext.Provider
      value={{
        height,
      }}
    >
      {children}
    </SubspaceContext.Provider>
  );
}

export function useRelayHeight() {
  const { height } = useContext(SubspaceContext);
  return height;
}
