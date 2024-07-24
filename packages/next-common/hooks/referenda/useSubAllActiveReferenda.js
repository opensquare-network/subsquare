import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useSubAllActiveReferenda() {
  const api = useContextApi();
  const [activeReferenda, setActiveReferenda] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.fellowshipReferenda.referendumInfoFor.entries((data) => {
      const result = data
        .map((item) => {
          const [
            {
              args: [referendumIndex],
            },
            referendum,
          ] = item;
          return [referendumIndex.toNumber(), referendum.unwrap()?.isOngoing];
        })
        .filter(([, isOngoing]) => isOngoing)
        .map(([referendumIndex]) => referendumIndex);

      setActiveReferenda(result);
      setIsLoading(false);
    });
  }, [api]);

  return { activeReferenda, isLoading };
}
