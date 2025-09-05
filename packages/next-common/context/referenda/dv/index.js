import { usePageProps } from "next-common/context/page";
import { createContext, useContext, useMemo, useState } from "react";
import { isNil } from "lodash-es";

export const DV_DATA_TYPE = {
  ALL_REFERENDA: "referenda",
  TRACK_REFERENDA: "track",
};

const DEFAULT_COUNT_TYPE = DV_DATA_TYPE.TRACK_REFERENDA;
const DvReferendaContext = createContext();

export default function DvDataTypeProvider({ children }) {
  const [countType, setCountType] = useState(DEFAULT_COUNT_TYPE);

  return (
    <DvReferendaContext.Provider value={{ countType, setCountType }}>
      {children}
    </DvReferendaContext.Provider>
  );
}

export function useDvReferendaCount() {
  const { cohort } = usePageProps();
  const { countType } = useDvReferenda();

  return useMemo(() => {
    if (cohort) {
      if (countType === DV_DATA_TYPE.ALL_REFERENDA) {
        return cohort.allReferendaCnt;
      } else if (countType === DV_DATA_TYPE.TRACK_REFERENDA) {
        return cohort.dvTrackReferendaCnt;
      }
    }
    return 0;
  }, [cohort, countType]);
}

export function useDvReferenda() {
  return useContext(DvReferendaContext) || {};
}

export function useFilteredDvReferenda() {
  const { referenda = [], cohort } = usePageProps();
  const { countType } = useDvReferenda();

  return useMemo(() => {
    if (countType === DV_DATA_TYPE.TRACK_REFERENDA) {
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
    if (countType === DV_DATA_TYPE.TRACK_REFERENDA) {
      return votes.filter((vote) => ids.includes(vote.referendumIndex));
    }
    return votes;
  }, [votes, countType, ids]);
}

export function useDvDelegateGuardians() {
  const { cohort } = usePageProps();

  if (isNil(cohort) || isNil(cohort.guardianCnt))
    return {
      guardiansCount: 0,
      hasGuardians: false,
    };

  const guardiansCount = cohort.guardianCnt;

  return {
    guardiansCount,
    hasGuardians: guardiansCount > 0,
  };
}
