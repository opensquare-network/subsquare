import { usePageProps } from "next-common/context/page";
import { createContext, useContext, useMemo, useState } from "react";

const DEFAULT_COUNT_TYPE = "track";
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

export function useFilteredDvReferenda() {
  const { referenda = [], cohort } = usePageProps();
  const { countType } = useReferendaDv();

  return useMemo(() => {
    if (countType === "track") {
      return referenda.filter((referendum) =>
        cohort?.tracks?.includes(referendum.track),
      );
    }
    return referenda;
  }, [referenda, countType, cohort]);
}

export function useFilteredDvVotes() {
  const { votes = [], cohort } = usePageProps();
  const { countType } = useReferendaDv();
  const referenda = useFilteredDvReferenda();
  const ids = useMemo(() => {
    return referenda
      .filter((referendum) => cohort?.tracks?.includes(referendum.track))
      .map((referendum) => referendum.referendumIndex);
  }, [referenda, cohort]);

  return useMemo(() => {
    if (countType === "track") {
      return votes.filter((vote) => ids.includes(vote.referendumIndex));
    }
    return votes;
  }, [votes, countType, ids]);
}
