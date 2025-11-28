import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import useBestNumber from "./useBestNumber";

export default function useSchedulerAgendas() {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);

  const bestNumber = useBestNumber();

  useEffect(() => {
    if (!api) {
      return;
    }
    api.query.scheduler?.agenda
      ?.entries((entries) => {
        setData(
          entries
            .map(([callKey, values]) => {
              const blockNumber = callKey.args[0]?.toNumber();
              const list = values.map((value) => {
                const json = value.toJSON();
                const unwrapped = value.unwrap();
                const originRole = unwrapped?.origin?.value?.type;
                const maybeId = unwrapped?.maybeId?.unwrapOr(null);
                const maybeIdHuman = maybeId?.toHuman();

                return {
                  ...json,
                  raw: unwrapped,
                  maybeId: maybeIdHuman,
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
  }, [api]);

  useEffect(() => {
    setFilteredData(data.filter((item) => item.blockNumber > bestNumber));
  }, [data, bestNumber]);

  return {
    data,
    filteredData,
    loading,
  };
}
