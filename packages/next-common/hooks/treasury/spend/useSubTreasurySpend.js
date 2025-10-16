import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { useTreasuryPallet } from "next-common/context/treasury";

export default function useSubTreasurySpend(index) {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [spend, setSpend] = useState();
  const treasuryPallet = useTreasuryPallet();

  useEffect(() => {
    if (!api || isNil(index)) {
      return;
    }

    let unsub;
    api.query[treasuryPallet]
      .spends(index, (optional) => {
        if (!optional || optional.isNone) {
          return;
        }

        setSpend(optional.unwrap().toJSON());
      })
      .then((result) => (unsub = result))
      .finally(() => setLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, index, treasuryPallet]);

  return { spend, loading };
}
