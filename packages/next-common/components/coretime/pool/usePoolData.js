import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useContextPapiApi } from "next-common/context/papi";
import { useContextApi } from "next-common/context/api";
import useCoretimeStatus from "next-common/context/coretime/status";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import {
  aggregatePoolHistory,
  buildHistoryTimeslices,
  formatPoolIo,
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

function formatIoEntry({ args, value }) {
  const [timeslice] = args ?? [];
  return {
    timeslice: Number(timeslice),
    private: Number(value?.private ?? 0),
    system: Number(value?.system ?? 0),
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
  const [poolIo, setPoolIo] = useState([]);
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

    const ioSubscription =
      api.query.Broker.InstaPoolIo.watchEntries().subscribe({
        next: ({ entries }) => setPoolIo((entries ?? []).map(formatIoEntry)),
        error: (error) => {
          console.error("Failed to watch coretime pool IO:", error);
          setPoolIo([]);
        },
      });

    return () => {
      contributionsSubscription.unsubscribe();
      ioSubscription.unsubscribe();
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

  const upcomingIo = useMemo(
    () => formatPoolIo(poolIo, status?.lastCommittedTimeslice),
    [poolIo, status?.lastCommittedTimeslice],
  );

  const historyDays = useMemo(
    () => aggregatePoolHistory({ timeslices, records: history, perDay }),
    [timeslices, history, perDay],
  );

  const totalPayout = useMemo(
    () =>
      history.reduce(
        (sum, record) => sum + Number(record?.maybe_payout ?? 0),
        0,
      ),
    [history],
  );

  return {
    systemPool: formatPoolSize(status?.systemPoolSize),
    privatePool: formatPoolSize(status?.privatePoolSize),
    contributions: formattedContributions,
    upcomingIo,
    historyDays,
    historyStep,
    totalPayout,
    lastTimeslice,
    loading:
      isContributionsLoading ||
      isHistoryLoading ||
      isNil(lastTimeslice) ||
      isNil(timeslicePeriod),
  };
}
