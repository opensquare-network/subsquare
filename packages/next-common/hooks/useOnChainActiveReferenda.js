import { useContextApi } from "next-common/context/api";
import { extractReferendumCall } from "next-common/utils/preimage";
import { useCallback, useEffect, useState } from "react";

async function extractActiveReferenda(api, entries) {
  const referenda = await Promise.all(
    entries.map(
      async ([
        {
          args: [id],
        },
        data,
      ]) => {
        const unwrappedData = data.unwrap();
        if (!unwrappedData?.isOngoing) {
          return null;
        }
        const referendumIndex = id.toNumber();
        const referendum = unwrappedData.asOngoing;
        let call;
        try {
          call = await extractReferendumCall(api, referendum);
        } catch {
          call = null;
        }

        return { referendumIndex, referendum, call };
      },
    ),
  );
  return referenda.filter(Boolean);
}

export function useOnChainActiveReferenda(pallet) {
  const api = useContextApi();
  const [activeReferenda, setActiveReferenda] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshId, setRefreshId] = useState(0);

  const fetch = useCallback(() => {
    setRefreshId((id) => id + 1);
  }, []);

  useEffect(() => {
    if (!api || !api.query?.[pallet]) {
      return;
    }

    let cancelled = false;

    api.query[pallet].referendumInfoFor
      .entries()
      .then((entries) => extractActiveReferenda(api, entries))
      .then((activeReferenda) => {
        if (cancelled) {
          return;
        }
        setActiveReferenda(activeReferenda);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, pallet, refreshId]);

  return { activeReferenda, isLoading, fetch };
}
