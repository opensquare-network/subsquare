import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import useBountyAppendants from "next-common/hooks/useBountyAppendants";

const BountyAppendantsContext = createContext();

export function BountyAppendantsProvider({ children, bountyIndex }) {
  const { fetch, value, loading } = useBountyAppendants(bountyIndex);
  const [appendants, setAppendants] = useState([]);

  useEffect(() => {
    if (value) {
      setAppendants(value);
    }
  }, [value]);

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
    <BountyAppendantsContext.Provider value={{ appendants, loading, update }}>
      {children}
    </BountyAppendantsContext.Provider>
  );
}

export function useBountyAppendantsContext() {
  const context = useContext(BountyAppendantsContext);
  return context;
}
