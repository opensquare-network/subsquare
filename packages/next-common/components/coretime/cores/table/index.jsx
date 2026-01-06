import { useMemo } from "react";
import { MapDataList } from "next-common/components/dataList";
import useAllCoreBrokers, { CoreTimeTypes } from "../hooks/useAllCoreBrokers";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { isNil } from "lodash-es";
import { usePageProps } from "next-common/context/page";
import { useContextApi } from "next-common/context/api";
import { useColumnsDef } from "../hooks/useColumnsDef";
import { SwitchTimeProvider } from "../context/switchTimeContext";

export default function CoretimeCoresTable() {
  const contextApi = useContextApi();
  const { coretimeSale } = usePageProps();
  const { cores = [], loading } = useAllCoreBrokers();

  const blocksPerTimesliceRelayChain = useMemo(() => {
    return contextApi?.consts.broker?.timeslicePeriod?.toNumber() ?? 0;
  }, [contextApi]);

  const formattedCores = useMemo(() => {
    return formartCores(cores, coretimeSale, blocksPerTimesliceRelayChain)
      .map((core) => ({
        ...core,
        workplans: formatWorkplans(
          core.workplans,
          coretimeSale,
          blocksPerTimesliceRelayChain,
        ),
      }))
      .sort((a, b) => a.coreIndex - b.coreIndex);
  }, [cores, coretimeSale, blocksPerTimesliceRelayChain]);

  const columnsDef = useColumnsDef();

  return (
    <SwitchTimeProvider>
      <SecondaryCard>
        <MapDataList
          columnsDef={columnsDef}
          data={formattedCores}
          contentClassName="[&_.pb-4]:!pl-[54px]"
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
  const startTimeSlice = info.regionBegin - configuration.regionLength;
  const endTimeSlice = info.regionBegin;
  return cores.map((core) =>
    formartRow(core, startTimeSlice, endTimeSlice, {
      coretimeSale,
      blocksPerTimesliceRelayChain,
    }),
  );
}

function formatWorkplans(
  workplans = [],
  coretimeSale,
  blocksPerTimesliceRelayChain,
) {
  if (isNil(coretimeSale)) {
    return workplans;
  }
  const { info, configuration } = coretimeSale;
  const endTimeSlice = info.regionBegin + configuration.regionLength;
  return workplans.map((workplan) =>
    formartRow(workplan, workplan.timeslice, endTimeSlice, {
      coretimeSale,
      blocksPerTimesliceRelayChain,
    }),
  );
}

function formartRow(
  core,
  startTimeSlice,
  endTimeSlice,
  { coretimeSale, blocksPerTimesliceRelayChain } = {},
) {
  if (!coretimeSale || !blocksPerTimesliceRelayChain) {
    return core;
  }
  const { configuration } = coretimeSale;
  if (core.occupancyType === CoreTimeTypes.Lease && core.lease) {
    const period = Math.floor(core.lease.until / configuration.regionLength);
    const endTimeSlice = period * configuration.regionLength;
    const endRelayBlock = endTimeSlice * blocksPerTimesliceRelayChain;
    return {
      ...core,
      startRelayBlock: null,
      endRelayBlock,
    };
  }

  const startRelayBlock = startTimeSlice * blocksPerTimesliceRelayChain;
  const endRelayBlock = endTimeSlice * blocksPerTimesliceRelayChain;
  return {
    ...core,
    startRelayBlock,
    endRelayBlock,
  };
}
