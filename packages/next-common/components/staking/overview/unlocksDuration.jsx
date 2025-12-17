import { useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import { useGlobalRelayChainApi } from "next-common/hooks/useGlobalRelayChainApi";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import FieldLoading from "next-common/components/icons/fieldLoading";
import Duration from "next-common/components/duration";

export function UnlocksDuration({ era }) {
  const api = useContextApi();
  const relayApi = useGlobalRelayChainApi();
  const { loading: isActiveEraLoading, result: optActiveEra } = useSubStorage(
    "staking",
    "activeEra",
    [],
  );

  const { endTimestamp, loading } = useMemo(() => {
    if (isActiveEraLoading || !optActiveEra || !api || !relayApi) {
      return { loading: true };
    }

    const activeEra = optActiveEra.toJSON();
    const expectedBlockTime = relayApi.consts.babe.expectedBlockTime.toNumber();
    const epochDuration = relayApi.consts.babe.epochDuration.toNumber();
    const sessionsPerEra = api.consts.staking.sessionsPerEra.toNumber();

    const start = activeEra.start; // start timestamp
    const adjustedEra = era - activeEra.index;
    const eraDurationBlocks = epochDuration * sessionsPerEra;
    const eraDuration = eraDurationBlocks * expectedBlockTime;
    const endTimestamp = start + adjustedEra * eraDuration;

    return {
      loading: false,
      endTimestamp,
    };
  }, [api, relayApi, era, optActiveEra, isActiveEraLoading]);

  if (loading) {
    return <FieldLoading size={12} />;
  }

  return (
    <span>
      Unlocks <Duration time={endTimestamp} slice={2} />
    </span>
  );
}
