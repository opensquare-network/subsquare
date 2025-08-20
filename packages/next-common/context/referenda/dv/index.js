import { usePageProps } from "next-common/context/page";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";

const DEFAULT_COUNT_TYPE = "referenda";
const STORAGE_KEY = "ReferendaDvCount";

const ReferendaDvContext = createContext();

export default function ReferendaDvProvider({ children }) {
  const [storageTabId, setStorageTabId] = useLocalStorage(
    STORAGE_KEY,
    DEFAULT_COUNT_TYPE,
  );
  const [countType, setCountType] = useState(storageTabId);

  useEffect(() => {
    setStorageTabId(countType || DEFAULT_COUNT_TYPE);
  }, [countType, setStorageTabId]);

  return (
    <ReferendaDvContext.Provider value={{ countType, setCountType }}>
      {children}
    </ReferendaDvContext.Provider>
  );
}

export function useReferendaDvCount() {
  const { cohort } = usePageProps();
  const { countType } = useReferendaDv();

  return useMemo(() => {
    if (cohort) {
      if (countType === "referenda") {
        return cohort.allReferendaCnt;
      } else if (countType === "track") {
        return cohort.dvTrackReferendaCnt;
      }
    }
    return 0;
  }, [cohort, countType]);
}

export function useReferendaDv() {
  return useContext(ReferendaDvContext) || {};
}
