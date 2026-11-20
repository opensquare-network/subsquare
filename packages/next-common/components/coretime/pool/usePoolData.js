import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useContextPapiApi } from "next-common/context/papi";
import { useContextApi } from "next-common/context/api";
import useCoretimeStatus from "next-common/context/coretime/status";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import {
  aggregatePoolHistory,
  buildHistoryTimeslices,
  formatPoolSize,
  getContributionStatus,
} from "./utils";

function formatContributionEntry({ args, value }) {
  const [regionId] = args ?? [];
  return {
    begin: Number(regionId?.begin),
    core: Number(regionId?.core),
    mask: regionId?.mask,
    length: Number(value?.length ?? 0),
    payee: value?.payee,
  };
}

export default function usePoolData({ days = 7 } = {}) {
  const api = useContextPapiApi();
  const contextApi = useContextApi();
  const status = useCoretimeStatus();
  const relayChainBlockTime = useRelayChainBlockTime();
  const timeslicePeriod =
    contextApi?.consts.broker?.timeslicePeriod?.toNumber();

  const [contributions, setContributions] = useState([]);
  const [isContributionsLoading, setContributionsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(1);
  const [isHistoryLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    const contributionsSubscription =
      api.query.Broker.InstaPoolContribution.watchEntries().subscribe({
        next: ({ entries }) => {
          setContributionsLoading(false);
          setContributions((entries ?? []).map(formatContributionEntry));
        },
        error: (error) => {
          console.error("Failed to watch coretime pool contributions:", error);
          setContributions([]);
          setContributionsLoading(false);
        },
      });

    return () => {
      contributionsSubscription.unsubscribe();
    };
  }, [api]);

  const { timeslices, step, perDay } = useMemo(
    () =>
      buildHistoryTimeslices({
        lastTimeslice: status?.lastTimeslice,
        days,
        timeslicePeriod,
        relayBlockTime: relayChainBlockTime,
      }),
    [status?.lastTimeslice, days, timeslicePeriod, relayChainBlockTime],
  );

  useEffect(() => {
    if (!api || !timeslices.length) {
      return;
    }

    let cancelled = false;
    setHistoryLoading(true);
    setHistoryStep(step);

    api.query.Broker.InstaPoolHistory.getValues(
      timeslices.map((timeslice) => [timeslice]),
    )
      .then((values) => {
        if (cancelled) {
          return;
        }
        setHistory(values ?? []);
      })
      .catch((error) => {
        console.error("Failed to read coretime pool history:", error);
        if (!cancelled) {
          setHistory([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, timeslices, step]);

  const lastTimeslice = status?.lastTimeslice;

  const formattedContributions = useMemo(
    () =>
      contributions
        .map((contribution) => ({
          ...contribution,
          status: getContributionStatus(contribution, lastTimeslice),
        }))
        .sort((a, b) => b.begin - a.begin || a.core - b.core),
    [contributions, lastTimeslice],
  );

  const historyDays = useMemo(
    () => aggregatePoolHistory({ timeslices, records: history, perDay }),
    [timeslices, history, perDay],
  );

  return {
    systemPool: formatPoolSize(status?.systemPoolSize),
    privatePool: formatPoolSize(status?.privatePoolSize),
    contributions: formattedContributions,
    historyDays,
    historyStep,
    lastTimeslice,
    // Data of the overview cards and of the contributions table does not depend
    // on the chart window, so they must not reload while the chart refetches.
    loading:
      isContributionsLoading || isNil(lastTimeslice) || isNil(timeslicePeriod),
    historyLoading:
      isHistoryLoading || isNil(lastTimeslice) || isNil(timeslicePeriod),
  };
}
