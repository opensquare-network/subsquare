import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useTotalStake() {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [currentEra, setCurrentEra] = useState(null);
  const [totalStake, setTotalStake] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub = null;
    api.query.staking
      .currentEra((currentEra) => {
        setCurrentEra(currentEra.toJSON());
      })
      .then((_unsub) => {
        unsub = _unsub;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api]);

  useEffect(() => {
    if (!api || !currentEra) {
      return;
    }

    let unsub = null;
    api.query.staking
      .erasTotalStake(currentEra, (eraTotalStake) => {
        setTotalStake(eraTotalStake.toJSON());
        setLoading(false);
      })
      .then((_unsub) => {
        unsub = _unsub;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, currentEra]);

  return {
    loading,
    totalStake,
    currentEra,
  };
}
