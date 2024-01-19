import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useSubFellowshipSalaryStats() {
  const api = useApi();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!api || !api.query?.fellowshipSalary?.status) {
      return;
    }

    let unsub;
    api.query.fellowshipSalary
      .status((rawOptional) => {
        if (rawOptional.isNone) {
          return;
        }

        setStats(rawOptional.unwrap().toJSON());
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api]);

  return stats;
}
