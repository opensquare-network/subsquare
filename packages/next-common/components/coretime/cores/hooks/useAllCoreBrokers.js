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
  const [workplans, setWorkplans] = useState([]);
  const [workloadLoading, setWorkloadLoading] = useState(false);

  useEffect(() => {
    if (contextApi) {
      setWorkloadLoading(true);
      Promise.all([
        contextApi?.query?.broker?.workplan?.entries?.(),
        contextApi?.query?.broker?.workload?.entries?.(),
      ])
        .then(([workplanEntries, workloadEntries]) => {
          const workplans = formatWorkplan(workplanEntries);
          const workloads = formatWorkload(workloadEntries);
          setWorkloads(workloads);
          setWorkplans(workplans);
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
      workplans: workplans
        .filter((w) => w.coreIndex === workload.coreIndex)
        .map((w) => ({
          ...w,
          occupancyType: getCoreTimeType(w, reservationMap, leaseMap),
        })),
    }));
  }, [workloads, leases, reservations, workplans]);

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

export function formatWorkplan(entries = []) {
  return entries.flatMap(([key, value]) => {
    const args = key.args?.[0];
    if (!args || args.length < 2) {
      return null;
    }

    const timeslice = args[0]?.toNumber();
    const core = args[1]?.toNumber();

    if (timeslice === undefined || core === undefined) {
      return null;
    }

    if (!value || !value.isSome) {
      return null;
    }

    const scheduleItems = value.unwrap();

    if (!scheduleItems || scheduleItems.length === 0) {
      return null;
    }

    const assignment = scheduleItems[0]?.assignment;

    const info = {};

    if (assignment?.isTask) {
      info.isTask = true;
      info.taskId = assignment?.asTask?.toNumber?.();
    } else if (assignment?.isPool) {
      info.isPool = true;
    } else {
      info.isIdle = true;
    }

    if (assignment?.mask) {
      info.mask = assignment.mask.toHex();
    }

    return {
      coreIndex: core,
      timeslice,
      ...info,
    };
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
