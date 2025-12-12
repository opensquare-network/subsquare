import { useContextApi } from "next-common/context/api";
import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";
import { useCallback } from "react";

const { useGlobalCachedFetch } = createGlobalCachedFetch();

function normalizeStakerOverviewItem(item) {
  const account = item[0].args[1].toString();
  const info = item[1].toJSON();
  return { ...info, account };
}

export function useActiveValidators() {
  const api = useContextApi();

  const fetchDataFunc = useCallback(
    async (setResult) => {
      if (
        !api ||
        !api.query.staking?.activeEra ||
        !api.query.staking?.erasStakersOverview
      ) {
        return;
      }

      try {
        const activeEra = await api.query.staking.activeEra();
        const eraIndex = activeEra.toJSON()?.index;
        const stakerOverview =
          await api.query.staking.erasStakersOverview.entries(eraIndex);
        const normalizedStakerOverview = stakerOverview.map(
          normalizeStakerOverviewItem,
        );
        setResult(normalizedStakerOverview);
      } catch (e) {
        console.error(e);
        // ignore
      }
    },
    [api],
  );

  const {
    result: validators,
    fetch,
    loading,
  } = useGlobalCachedFetch(fetchDataFunc, "staking.activeValidators");

  return {
    validators,
    fetch,
    loading: !validators && loading,
  };
}
