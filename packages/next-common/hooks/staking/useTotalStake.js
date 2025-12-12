import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export function useTotalStake() {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [activeEraIndex, setActiveEraIndex] = useState(null);
  const [totalStake, setTotalStake] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub = null;
    api.query.staking
      .activeEra((activeEra) => {
        setActiveEraIndex(activeEra.toJSON()?.index);
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
    if (!api || !activeEraIndex) {
      return;
    }

    let unsub = null;
    api.query.staking
      .erasTotalStake(activeEraIndex, (eraTotalStake) => {
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
  }, [api, activeEraIndex]);

  return {
    loading,
    totalStake,
    activeEraIndex,
  };
}
