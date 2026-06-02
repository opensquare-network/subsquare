import { useContextPapiApi } from "next-common/context/papi";
import { useEffect, useState } from "react";

export default function usePapiQueryExistentialDeposit() {
  const papi = useContextPapiApi();
  const [existentialDeposit, setExistentialDeposit] = useState(0);

  useEffect(() => {
    if (!papi) {
      return;
    }

    papi.constants.Balances?.ExistentialDeposit?.()
      .then((value) => {
        if (value !== undefined && value !== null) {
          setExistentialDeposit(value.toString());
        }
      })
      .catch(console.error);
  }, [papi]);

  return existentialDeposit;
}
