import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import useSubStorage from "../common/useSubStorage";

export function useEraTimeLeft() {
  const api = useContextApi();
  const { loading, result: activeEra } = useSubStorage(
    "staking",
    "activeEra",
    [],
  );

  const get = useCallback(async () => {
    if (!loading) {
      return;
    }

    const expectedBlockTime = api.consts.babe.expectedBlockTime;
    const epochDuration = api.consts.babe.epochDuration;
    const sessionsPerEra = api.consts.staking.sessionsPerEra;

    // Get timestamp of era start and convert to seconds
    const start = activeEra.start / 1000n;

    // Store the duration of an era in block numbers
    const eraDurationBlocks = epochDuration * BigInt(sessionsPerEra);

    // Estimate the duration of the era in seconds
    const eraDuration = Number((eraDurationBlocks * expectedBlockTime) / 1000n);

    // Estimate the end time of the era
    const end = Number(start) + eraDuration;

    // Estimate remaining time of era
    const timeleft = Math.max(0, end - Date.now());

    // Percentage of eraDuration
    const percentage = eraDuration / 100;
    const percentRemaining = timeleft === 0 ? 100 : timeleft / percentage;
    const percentSurpassed = timeleft === 0 ? 0 : 100 - percentRemaining;

    return { timeleft, end, percentSurpassed, percentRemaining };
  }, [api, activeEra, loading]);

  return {
    get,
    loading,
  };
}
