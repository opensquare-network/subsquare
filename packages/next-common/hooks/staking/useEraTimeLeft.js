import { useMemo } from "react";
import useSubStorage from "../common/useSubStorage";
import useNow from "../useNow";
import { useRelayChainApi } from "next-common/context/relayChain";
import { useContextApi } from "next-common/context/api";

export function useEraTimeLeft() {
  const api = useContextApi();
  const relayApi = useRelayChainApi();
  const { loading, result: _activeEra } = useSubStorage(
    "staking",
    "activeEra",
    [],
  );
  const nowTimestamp = useNow(60 * 1000);
  const activeEra = _activeEra?.toJSON();

  return useMemo(() => {
    if (!api || !relayApi || loading) {
      return { loading: true };
    }

    const expectedBlockTime = relayApi.consts.babe.expectedBlockTime.toNumber();
    const epochDuration = relayApi.consts.babe.epochDuration.toNumber();
    const sessionsPerEra = api.consts.staking.sessionsPerEra.toNumber();

    const start = activeEra.start;
    const eraDurationBlocks = epochDuration * sessionsPerEra;
    const eraDuration = eraDurationBlocks * expectedBlockTime;
    const end = start + eraDuration;
    const timeleft = Math.max(0, end - nowTimestamp);

    const percentage = eraDuration / 100;
    const percentRemaining = timeleft === 0 ? 100 : timeleft / percentage;
    const percentSurpassed = timeleft === 0 ? 0 : 100 - percentRemaining;

    return {
      loading: false,
      timeleft,
      end,
      percentSurpassed,
      percentRemaining,
    };
  }, [api, relayApi, activeEra, loading, nowTimestamp]);
}
