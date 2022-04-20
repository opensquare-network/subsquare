import React, { useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";

function isNewDepositors(depositors) {
  return Array.isArray(depositors[0]);
}

export default function useDepositOf(
  api,
  proposalIndex,
  atBlockHeight,
  triggerUpdate
) {
  const [seconds, setSeconds] = useState([]);
  const [depositRequired, setDepositRequired] = useState(0);
  const [isLoadingSeconds, setIsLoadingSeconds] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoadingSeconds(true);

    Promise.resolve(api)
      .then((api) => {
        if (atBlockHeight) {
          return api.rpc.chain
            .getBlockHash(atBlockHeight)
            .then((blockHash) => api.at(blockHash));
        }
        return api;
      })
      .then((api) => api.query.democracy.depositOf(proposalIndex))
      .then((res) => {
        if (isMounted.current) {
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
        if (isMounted.current) {
          setIsLoadingSeconds(false);
        }
      });
  }, [api, proposalIndex, atBlockHeight, triggerUpdate, isMounted]);

  return [seconds, depositRequired, isLoadingSeconds];
}
