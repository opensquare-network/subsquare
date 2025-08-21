import { usePageProps } from "next-common/context/page";
import { createContext, useContext, useMemo, useState } from "react";

const DEFAULT_COUNT_TYPE = "referenda";
const ReferendaDvContext = createContext();

export default function ReferendaDvProvider({ children }) {
  const [countType, setCountType] = useState(DEFAULT_COUNT_TYPE);

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
