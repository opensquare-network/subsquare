import { useMemo } from "react";
import { MapDataList } from "next-common/components/dataList";
import useAllCoreBrokers, { CoreTimeTypes } from "../hooks/useAllCoreBrokers";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useContextApi } from "next-common/context/api";
import { useTimeColumnsDef } from "../hooks/useColumnsDef";
import { SwitchTimeProvider } from "../context/switchTimeContext";

export default function CoretimeCoresTable() {
  const contextApi = useContextApi();
  const { coretimeSale } = usePageProps();
  const { cores = [], loading } = useAllCoreBrokers();

  const blocksPerTimesliceRelayChain = useMemo(() => {
    return contextApi?.consts.broker?.timeslicePeriod?.toNumber() ?? 0;
  }, [contextApi]);

  const formattedCores = useMemo(() => {
    return formartCores(cores, coretimeSale, blocksPerTimesliceRelayChain).sort(
      (a, b) => a.coreIndex - b.coreIndex,
    );
  }, [cores, coretimeSale, blocksPerTimesliceRelayChain]);

  const columnsDef = useTimeColumnsDef();

  return (
    <SwitchTimeProvider>
      <SecondaryCard>
        <MapDataList
          columnsDef={columnsDef}
          data={formattedCores}
          loading={loading}
          noDataText="No cores"
        />
      </SecondaryCard>
    </SwitchTimeProvider>
  );
}

function formartCores(cores = [], coretimeSale, blocksPerTimesliceRelayChain) {
  if (isNil(coretimeSale)) {
    return cores;
  }
  const { info, configuration } = coretimeSale;
  return cores.map((core) => {
    if (core.occupancyType === CoreTimeTypes.Lease && core.lease) {
      const period = Math.floor(core.lease.until / configuration.regionLength);
      const endTimeSplit = period * configuration.regionLength;
      const endRelayBlock = endTimeSplit * blocksPerTimesliceRelayChain;
      return {
        ...core,
        startRelayBlock: null,
        endRelayBlock,
      };
    }
    const startTimeSplit = info.regionBegin - configuration.regionLength;
    const startRelayBlock = startTimeSplit * blocksPerTimesliceRelayChain;
    const endRelayBlock = info.regionBegin * blocksPerTimesliceRelayChain;
    return {
      ...core,
      startRelayBlock,
      endRelayBlock,
    };
  });
}
