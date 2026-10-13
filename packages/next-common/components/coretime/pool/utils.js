import { isNil } from "lodash-es";
import { RegionStatus } from "next-common/components/coretime/regions/utils";

// A core is made of 80 core mask bits.
export const BITS_PER_CORE = 80;

// Upper bound of storage keys fetched in a single page load. Reading many keys
// at once takes a disproportionally long time on Coretime RPC nodes (about one
// second for 630 keys, five for 1260), so longer windows are sampled instead of
// read timeslice by timeslice.
export const MAX_HISTORY_KEYS = 630;

export const POOL_WINDOWS = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
];

export function bitsToCores(bits) {
  const cores = Number(bits ?? 0) / BITS_PER_CORE;
  return Number.isInteger(cores) ? cores : Number(cores.toFixed(2));
}

export function formatPoolSize(bits) {
  const value = Number(bits ?? 0);
  return {
    bits: value,
    cores: bitsToCores(value),
  };
}

export function getContributionStatus({ begin, length }, lastTimeslice) {
  if (isNil(begin) || isNil(length)) {
    return null;
  }

  if (lastTimeslice < begin) {
    return RegionStatus.Upcoming;
  }

  if (lastTimeslice >= begin + length) {
    return RegionStatus.Expired;
  }

  return RegionStatus.Active;
}

export function timeslicesPerDay(timeslicePeriod, relayBlockTime) {
  const secondsPerTimeslice =
    (Number(timeslicePeriod) * Number(relayBlockTime)) / 1000;
  if (!secondsPerTimeslice) {
    return 0;
  }
  return 86400 / secondsPerTimeslice;
}

// Timeslices of the `days` long window ending at `lastTimeslice`, oldest first,
// sampled with a step that keeps the amount of queried keys within `maxKeys`.
export function buildHistoryTimeslices({
  lastTimeslice,
  days,
  timeslicePeriod,
  relayBlockTime,
  maxKeys = MAX_HISTORY_KEYS,
}) {
  const perDay = timeslicesPerDay(timeslicePeriod, relayBlockTime);
  if (isNil(lastTimeslice) || !perDay || !days) {
    return { timeslices: [], step: 1, perDay };
  }

  const count = Math.round(days * perDay);
  const step = Math.max(1, Math.ceil(count / maxKeys));
  // Newest timeslice is always included, the rest is sampled backwards.
  const offsets = [];
  for (let offset = count - 1; offset > 0; offset -= step) {
    offsets.push(offset);
  }
  offsets.push(0);

  const timeslices = offsets
    .map((offset) => lastTimeslice - offset)
    .filter((timeslice) => timeslice >= 0);

  return { timeslices, step, perDay };
}

// Groups the per-timeslice pool records into one entry per day. The pool size
// is a level rather than a flow, so the daily value is its average over the
// sampled timeslices of that day.
export function aggregatePoolHistory({
  timeslices = [],
  records = [],
  perDay,
}) {
  if (!perDay || !timeslices.length) {
    return [];
  }

  const windowStart = timeslices[0];
  const days = new Map();

  timeslices.forEach((timeslice, index) => {
    const record = records[index];
    if (isNil(record)) {
      return;
    }

    const day = Math.floor((timeslice - windowStart) / perDay);
    const bucket = days.get(day) ?? {
      day,
      startTimeslice: timeslice,
      count: 0,
      privateTotal: 0,
      systemTotal: 0,
      payoutTotal: 0,
      hasPayout: false,
    };

    bucket.count += 1;
    bucket.privateTotal += Number(record.private_contributions ?? 0);
    bucket.systemTotal += Number(record.system_contributions ?? 0);
    if (!isNil(record.maybe_payout)) {
      bucket.payoutTotal += Number(record.maybe_payout);
      bucket.hasPayout = true;
    }

    days.set(day, bucket);
  });

  return [...days.values()]
    .sort((a, b) => a.day - b.day)
    .map((bucket) => ({
      day: bucket.day,
      startTimeslice: bucket.startTimeslice,
      private: bitsToCores(bucket.privateTotal / bucket.count),
      system: bitsToCores(bucket.systemTotal / bucket.count),
      payout: bucket.hasPayout ? bucket.payoutTotal : 0,
    }));
}

// Upcoming pool size changes, earliest first. A negative delta means the pool
// shrinks, because the coretime backing it is no longer available.
export function formatPoolIo(entries = [], lastTimeslice) {
  return entries
    .map(({ timeslice, private: privateDelta, system: systemDelta }) => ({
      timeslice: Number(timeslice),
      private: Number(privateDelta ?? 0),
      system: Number(systemDelta ?? 0),
      delta: Number(privateDelta ?? 0) + Number(systemDelta ?? 0),
    }))
    .filter((item) => isNil(lastTimeslice) || item.timeslice >= lastTimeslice)
    .sort((a, b) => a.timeslice - b.timeslice);
}
