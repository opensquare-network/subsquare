import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useSchedulerAgendas() {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

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

                return {
                  ...json,
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

  return {
    data,
    loading,
  };
}
