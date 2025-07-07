import { createContext, useContext, useCallback, useState } from "react";
import useReferendaAppendants from "next-common/hooks/useReferendaAppendants";
import { usePageProps } from "next-common/context/page";

const ReferendaAppendantsContext = createContext();

export function ReferendaAppendantsProvider({ children }) {
  const { appendants: appendantsFromSSR, id } = usePageProps();
  const [appendants, setAppendants] = useState(appendantsFromSSR);
  const { fetch } = useReferendaAppendants(id);

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
    <ReferendaAppendantsContext.Provider value={{ appendants, update }}>
      {children}
    </ReferendaAppendantsContext.Provider>
  );
}

export function useReferendaAppendantsContext() {
  const context = useContext(ReferendaAppendantsContext);
  return context;
}
 