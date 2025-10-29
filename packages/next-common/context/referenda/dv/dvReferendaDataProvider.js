import { usePageProps } from "next-common/context/page";
import { createContext, useContext } from "react";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";

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
      .then((res) =>
        res.result.map(({ tally, state, trackInfo, ...item }) => {
          return {
            ...item,
            tally,
            state,
            trackInfo,
            onchainData: { tally, state, trackInfo },
          };
        }),
      );
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
