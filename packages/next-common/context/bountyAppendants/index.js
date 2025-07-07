import { createContext, useContext, useCallback, useState } from "react";
import useBountyAppendants from "next-common/hooks/useBountyAppendants";
import { usePageProps } from "next-common/context/page";

const BountyAppendantsContext = createContext();

export function BountyAppendantsProvider({ children }) {
  const { appendants: appendantsFromSSR, id } = usePageProps();
  const [appendants, setAppendants] = useState(appendantsFromSSR);
  const { fetch } = useBountyAppendants(id);

  const update = useCallback(async () => {
    try {
      const result = await fetch();
      if (result) {
        setAppendants(result);
      }
    } catch (err) {
      console.error("Failed to update appendants:", err);
    }
  }, [fetch]);

  return (
    <BountyAppendantsContext.Provider value={{ appendants, update }}>
      {children}
    </BountyAppendantsContext.Provider>
  );
}

export function useBountyAppendantsContext() {
  const context = useContext(BountyAppendantsContext);
  return context;
}
