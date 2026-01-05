import { useEffect, useState, useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export const CoreTimeTypes = {
  BulkCoretime: "Bulk Coretime",
  Reservation: "Reservation",
  OnDemand: "On Demand",
  Lease: "Lease",
};

export default function useBrokerStatus() {
  const { result: leases, loading: isLeasesLoading } = useSubStorage(
    "broker",
    "leases",
  );
  const { result: reservations, loading: isReservationsLoading } =
    useSubStorage("broker", "reservations");

  const contextApi = useContextApi();
  const [workloads, setWorkloads] = useState([]);
  const [workloadLoading, setWorkloadLoading] = useState(false);

  useEffect(() => {
    if (contextApi) {
      setWorkloadLoading(true);
      contextApi?.query?.broker?.workload
        ?.entries?.()
        .then((entries) => {
          const workloads = formatWorkload(entries);
          setWorkloads(workloads);
        })
        .catch(console.error)
        .finally(() => setWorkloadLoading(false));
    }
  }, [contextApi]);

  const cores = useMemo(() => {
    const reservationMap = buildTaskMap(reservations);
    const leaseMap = buildTaskMap(leases);

    return workloads.map((workload) => ({
      ...workload,
      lease: leaseMap[workload.taskId] ?? null,
      occupancyType: getCoreTimeType(workload, reservationMap, leaseMap),
    }));
  }, [workloads, leases, reservations]);

  const loading = useMemo(
    () => isLeasesLoading || isReservationsLoading || workloadLoading,
    [isLeasesLoading, isReservationsLoading, workloadLoading],
  );

  return {
    cores,
    workloads,
    loading,
  };
}

function formatWorkload(workloads = []) {
  return workloads.map(([key, value]) => {
    const coreIndex = key.args[0].toNumber();
    const assignment = value?.[0]?.assignment;

    const data = {
      coreIndex,
      isPool: assignment?.isPool,
      isTask: assignment?.isTask,
      isIdle: assignment?.isIdle,
    };

    if (assignment?.isTask) {
      data.taskId = assignment?.asTask?.toNumber();
    }

    return data;
  });
}

function buildTaskMap(data) {
  if (!data || data.isEmpty) {
    return {};
  }
  const map = data.reduce((acc, item) => {
    if (Array.isArray(item)) {
      const assignment = item?.[0].assignment;
      const taskId = assignment?.isTask
        ? assignment?.asTask?.toNumber()
        : undefined;
      acc[taskId] = assignment;
    } else {
      const data = item.toJSON();
      const taskId = data.task;
      acc[taskId] = data;
    }
    return acc;
  }, {});
  return map;
}

export function getCoreTimeType(workload, reservationMap, leaseMap) {
  if (workload.isIdle) {
    return CoreTimeTypes.BulkCoretime;
  } else if (workload.isPool) {
    return CoreTimeTypes.OnDemand;
  }

  let reservation = null;
  let lease = null;

  if (workload.taskId) {
    reservation = reservationMap?.[workload.taskId];
    lease = leaseMap?.[workload.taskId];
  }

  if (reservation) {
    return CoreTimeTypes.Reservation;
  } else if (lease) {
    return CoreTimeTypes.Lease;
  }
  return CoreTimeTypes.BulkCoretime;
}
