import { useState, useEffect } from "react";
import { useMountedState } from "react-use";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

function isNewDepositors(depositors) {
  return Array.isArray(depositors[0]);
}

export default function useDepositOf(proposalIndex, triggerUpdate) {
  const [seconds, setSeconds] = useState([]);
  const [depositRequired, setDepositRequired] = useState(0);
  const [isLoadingSeconds, setIsLoadingSeconds] = useState(true);
  const isMounted = useMountedState();
  const api = useConditionalContextApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoadingSeconds(true);

    Promise.resolve(api)
      .then((api) => api.query.democracy.depositOf(proposalIndex))
      .then((res) => {
        if (isMounted()) {
          const deposit = res.toJSON();
          if (deposit) {
            if (isNewDepositors(deposit)) {
              setSeconds(deposit[0]);
              setDepositRequired(deposit[1]);
            } else {
              setSeconds(deposit[1]);
              setDepositRequired(deposit[0]);
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted()) {
          setIsLoadingSeconds(false);
        }
      });
  }, [api, proposalIndex, triggerUpdate, isMounted]);

  return [seconds, depositRequired, isLoadingSeconds];
}
