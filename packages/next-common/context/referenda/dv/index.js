import { usePageProps } from "next-common/context/page";
import { createContext, useContext, useMemo, useState } from "react";

export const AllReferenda = "referenda";
export const TrackReferenda = "track";

const DEFAULT_COUNT_TYPE = TrackReferenda;
const ReferendaDvContext = createContext();

export default function ReferendaDvProvider({ children }) {
  const [countType, setCountType] = useState(DEFAULT_COUNT_TYPE);

  return (
    <ReferendaDvContext.Provider value={{ countType, setCountType }}>
      {children}
    </ReferendaDvContext.Provider>
  );
}

export function useDvReferendaCount() {
  const { cohort } = usePageProps();
  const { countType } = useDvReferenda();

  return useMemo(() => {
    if (cohort) {
      if (countType === AllReferenda) {
        return cohort.allReferendaCnt;
      } else if (countType === TrackReferenda) {
        return cohort.dvTrackReferendaCnt;
      }
    }
    return 0;
  }, [cohort, countType]);
}

export function useDvReferenda() {
  return useContext(ReferendaDvContext) || {};
}

export function useFilteredDvReferenda() {
  const { referenda = [], cohort } = usePageProps();
  const { countType } = useDvReferenda();

  return useMemo(() => {
    if (countType === TrackReferenda) {
      return referenda.filter((referendum) =>
        cohort?.tracks?.includes(referendum.track),
      );
    }
    return referenda;
  }, [referenda, countType, cohort]);
}

export function useFilteredDvVotes() {
  const { votes = [], cohort } = usePageProps();
  const { countType } = useDvReferenda();
  const referenda = useFilteredDvReferenda();
  const ids = useMemo(() => {
    return referenda
      .filter((referendum) => cohort?.tracks?.includes(referendum.track))
      .map((referendum) => referendum.referendumIndex);
  }, [referenda, cohort]);

  return useMemo(() => {
    if (countType === TrackReferenda) {
      return votes.filter((vote) => ids.includes(vote.referendumIndex));
    }
    return votes;
  }, [votes, countType, ids]);
}
