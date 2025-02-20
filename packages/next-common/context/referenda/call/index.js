import { createContext } from "react";
import useBlockPreimage from "next-common/hooks/preimages/useBlockPreimage";

export const ReferendumCallContext = createContext(null);

export default function ReferendumCallProvider({ hash, blockHash, children }) {
  const { preimage, isLoading } = useBlockPreimage(hash, blockHash);

  return (
    <ReferendumCallContext.Provider value={{ hash, isLoading, preimage }}>
      {children}
    </ReferendumCallContext.Provider>
  );
}
