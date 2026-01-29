import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";

export default function useSchedulerAgendas() {
  const papi = useContextPapiApi();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!papi) {
      return;
    }
    papi.query.Scheduler.Agenda.getEntries()
      .then((entries) => {
        setData(
          entries
            .map(({ keyArgs, value: values }) => {
              const blockNumber = keyArgs[0];
              const list = values.map((value) => {
                const originRole = value?.origin?.value?.type ?? null;
                const maybeId = value?.maybeId ?? null;

                return {
                  ...value,
                  maybeId,
                  originRole,
                  blockNumber,
                };
              });
              return list;
            })
            .flat()
            .sort((a, b) => a.blockNumber - b.blockNumber),
        );
      })
      .finally(() => setLoading(false));
  }, [papi]);

  return {
    data,
    loading,
  };
}

export function useSchedulerAgendasWithScanHeight(scanHeight) {
  const { data, loading } = useSchedulerAgendas();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data.filter((item) => item.blockNumber > scanHeight));
  }, [data, scanHeight]);

  return {
    data,
    filteredData,
    loading,
  };
}
