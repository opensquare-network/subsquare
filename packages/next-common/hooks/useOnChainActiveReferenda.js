import { useContextApi } from "next-common/context/api";
import { extractReferendumCall } from "next-common/utils/preimage";
import { useEffect, useState } from "react";

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
        } catch (e) {
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

  useEffect(() => {
    if (!api) {
      return;
    }
    api.query[pallet].referendumInfoFor
      .entries()
      .then((entries) => extractActiveReferenda(api, entries))
      .then((activeReferenda) => {
        setActiveReferenda(activeReferenda);
      });
  }, [api, pallet]);

  return activeReferenda;
}
