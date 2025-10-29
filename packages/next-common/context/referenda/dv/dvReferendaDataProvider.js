import { usePageProps } from "next-common/context/page";
import { createContext, useContext } from "react";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";

export const DV_DATA_TYPE = {
  ALL_REFERENDA: "referenda",
  TRACK_REFERENDA: "track",
};

const DvReferendaDataContext = createContext();

export default function DvReferendaDataProvider({ children }) {
  const { cohort } = usePageProps();
  const {
    value = [],
    loading,
    error,
  } = useAsync(async () => {
    if (!cohort) {
      return [];
    }
    return await backendApi
      .fetch(`/dv/cohorts/${cohort.id}/referenda`)
      .then((res) => {
        const list = res.result.map(({ tally, state, trackInfo, ...item }) => {
          return {
            ...item,
            trackInfo,
            onchainData: { tally, state, trackInfo },
            state,
          };
        });
        return list.filter((item) => cohort.tracks.includes(item.track));
      });
  }, [cohort]);

  return (
    <DvReferendaDataContext.Provider
      value={{
        referendaData: value,
        loading,
        error,
      }}
    >
      {children}
    </DvReferendaDataContext.Provider>
  );
}

export function useDvReferendaData() {
  return useContext(DvReferendaDataContext) || {};
}
