import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";

export default function useSubTreasurySpend(index) {
  const api = useContextApi();
  const [spend, setSpend] = useState();

  useEffect(() => {
    if (!api || isNil(index)) {
      return;
    }

    let unsub;
    api.query.treasury
      .spends(index, (optional) => {
        if (!optional || optional.isNone) {
          return;
        }

        setSpend(optional.unwrap().toJSON());
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, index]);

  return spend;
}
