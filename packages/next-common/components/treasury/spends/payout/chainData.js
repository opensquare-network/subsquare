import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { ASSET_HUB_GENERAL_INDEX_SYMBOL } from "next-common/asset";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

// pallet-assets instance id in the Asset Hub runtime
const ASSET_HUB_PALLET_INSTANCE = 50;

const SPEND_STATUSES = ["Pending", "Attempted", "Failed"];

const ACTION_LABELS = {
  Pending: "Payout",
  Attempted: "Check Status",
  Failed: "Retry Payment",
};

// The head is rotated by `check_status`, so rotation reuses that call
const ROTATE_ACTION = {
  kind: "rotate",
  label: "Rotate",
  call: "checkStatus",
};

// A spend past its own `expire_at` can never be paid, only `check_status` can
// clean it up (which removes it and promotes the next queued spend)
const EXPIRED_ACTION = {
  kind: "expire",
  label: "Check Status",
  call: "checkStatus",
};

const CHECK_STATUS_ACTION = {
  kind: "checkStatus",
  label: ACTION_LABELS.Attempted,
  call: "checkStatus",
};

// A live spend missing from the payout order (e.g. skipped by the migration
// because the queue was full) is re-admitted by `check_status`
const REQUEUE_ACTION = {
  kind: "requeue",
  label: "Check Status",
  call: "checkStatus",
};

const QUEUED_ACTION = {
  kind: "queued",
  label: "Waiting",
  call: null,
};

function waitAction(label) {
  return { kind: "wait", label, call: null };
}

export function getPayoutSpendStatus(status) {
  const type = typeof status === "string" ? status : status?.type;
  return SPEND_STATUSES.includes(type) ? type : null;
}

export function getPayoutActionLabel(status) {
  const normalized = getPayoutSpendStatus(status);
  return normalized ? ACTION_LABELS[normalized] : null;
}

// The pallet rejects a payout of any spend that is not the `NextPayout` head of
// its asset kind (`NotNextPayout`), an un-matured head (`EarlyPayout`), a spend
// past its payout window (`SpendExpired`) and any spend that is not part of the
// payout order (the migration can skip spends when the queue is full).
//
// The decision needs a consistent chain snapshot: while the head, the queue or
// the block height is unknown no transaction is offered, so a payout is never
// built against stale ordering data.
export function getPayoutAction({
  status,
  validFrom,
  expireAt,
  spendExpireAt,
  firstQueuedOrderKey,
  latestHeight,
  isHead = true,
  inOrder = true,
  orderEnabled = true,
}) {
  const normalized = getPayoutSpendStatus(status);
  if (!normalized) {
    return null;
  }

  if (normalized === "Attempted") {
    return CHECK_STATUS_ACTION;
  }

  const hasHeight = !isNil(latestHeight);
  const now = Number(latestHeight);

  // At or past `expire_at` a payout is rejected (`expire_at > now` is required);
  // `check_status` removes the spend once the block is past it.
  if (hasHeight && !isNil(spendExpireAt) && Number(spendExpireAt) <= now) {
    return EXPIRED_ACTION;
  }

  if (!hasHeight) {
    return waitAction(ACTION_LABELS[normalized]);
  }

  if (!isNil(validFrom) && Number(validFrom) > now) {
    return waitAction(ACTION_LABELS[normalized]);
  }

  if (!orderEnabled) {
    return {
      kind: "payout",
      label: ACTION_LABELS[normalized],
      call: "payout",
    };
  }

  if (!inOrder) {
    return REQUEUE_ACTION;
  }

  if (!isHead) {
    return QUEUED_ACTION;
  }

  if (isNil(expireAt)) {
    return waitAction(ACTION_LABELS[normalized]);
  }

  // A lapsed head may only be retried while nothing behind it is mature;
  // otherwise `check_status` has to rotate it first.
  const leaseExpired = Number(expireAt) < now;
  const nextSpendMature =
    !isNil(firstQueuedOrderKey) && Number(firstQueuedOrderKey) <= now;

  if (leaseExpired && nextSpendMature) {
    return ROTATE_ACTION;
  }

  return {
    kind: "payout",
    label: ACTION_LABELS[normalized],
    call: "payout",
  };
}

export function getNextPayoutAction(args) {
  return getPayoutAction({ ...args, isHead: true, inOrder: true });
}

function getJunctions(interior) {
  if (!interior) {
    return null;
  }

  if (interior === "Here" || interior?.type === "Here") {
    return [];
  }

  const { type, value } = interior;
  if (!type || isNil(value)) {
    return null;
  }

  return Array.isArray(value) ? value : [value];
}

function getAssetIdLocation(rawAssetId) {
  if (!rawAssetId) {
    return null;
  }

  // xcm v3 AssetId is a Concrete/Abstract enum
  if (rawAssetId.type === "Concrete") {
    return rawAssetId.value;
  }

  if (rawAssetId.Concrete) {
    return rawAssetId.Concrete;
  }

  return rawAssetId;
}

// `VersionedLocatableAsset.location` is the reserve location the asset lives on
// (`Here` for assets paid locally). `asset_id` is relative to that location, so
// the same `PalletInstance`/`GeneralIndex` pair means something different on
// another chain's reserve.
function isHereLocation(location) {
  if (location === "Here") {
    return true;
  }

  if (!location || Number(location.parents ?? 0) !== 0) {
    return false;
  }

  const interior = location.interior;
  return interior === "Here" || interior?.type === "Here";
}

function describeAssetKind(assetKind) {
  const inner = assetKind?.value ?? assetKind;
  const location = inner?.location ?? null;
  const assetIdLocation = getAssetIdLocation(inner?.asset_id ?? inner?.assetId);
  const junctions = getJunctions(assetIdLocation?.interior) ?? [];
  const isLocal = isHereLocation(location);
  // On system parachains the native token is the relay chain's location, so a
  // local asset id without interior junctions is the native asset.
  const isNative = isLocal && junctions.length === 0;
  const palletInstance = findJunctionValue(junctions, "PalletInstance");
  const generalIndex = findJunctionValue(junctions, "GeneralIndex");
  const isPalletAsset =
    isLocal &&
    Number(assetIdLocation?.parents ?? 0) === 0 &&
    junctions.length === 2 &&
    Number(palletInstance) === ASSET_HUB_PALLET_INSTANCE &&
    !isNil(generalIndex);

  return {
    location,
    assetIdLocation,
    junctions,
    isLocal,
    isNative,
    isPalletAsset,
    assetId: isPalletAsset ? Number(generalIndex) : null,
    generalIndex,
    parachainId: findJunctionValue(junctions, "Parachain"),
  };
}

function findJunctionValue(junctions, type) {
  return junctions?.find((junction) => junction?.type === type)?.value;
}

export function getAssetKindKey(assetKind) {
  try {
    return JSON.stringify(assetKind, (_, value) =>
      typeof value === "bigint" ? `${value.toString()}n` : value,
    );
  } catch {
    return String(assetKind);
  }
}

export function getEntryAssetKind(entry) {
  return entry?.args?.[0] ?? entry?.keyArgs?.[0] ?? null;
}

// The asset kind is a `VersionedLocatableAsset`; the map is keyed by the raw
// (versioned) value until polkadot-sdk#13461 canonicalizes it, so the same asset
// can show up as a V4 and a V5 entry with separate orders.
export function getAssetKindVersion(assetKind) {
  const type = assetKind?.type;
  return typeof type === "string" && /^V\d+$/.test(type) ? type : null;
}

export function getPapiAssetKindInfo(
  assetKind,
  { chainSymbol, chainDecimals } = {},
) {
  const asset = describeAssetKind(assetKind);
  const { isLocal, isNative, isPalletAsset, assetId, generalIndex } = asset;

  let symbol = null;
  let label = "Asset";
  let decimals = null;

  if (isNative) {
    symbol = chainSymbol ?? null;
    decimals = isNil(chainDecimals) ? null : Number(chainDecimals);
    label = "Native";
  } else if (isPalletAsset) {
    const knownSymbol = ASSET_HUB_GENERAL_INDEX_SYMBOL[String(assetId)] ?? null;
    symbol = knownSymbol ?? `#${assetId}`;
    // Unknown pallet assets may use any decimals; the amount is resolved from
    // `Assets.Metadata` instead of being assumed to match the native token.
    decimals = knownSymbol ? SYMBOL_DECIMALS[knownSymbol] ?? null : null;
    label = `ForeignAsset #${assetId}`;
  } else if (!isNil(generalIndex)) {
    symbol = `#${Number(generalIndex)}`;
    label = isNil(asset.parachainId)
      ? `ForeignAsset #${Number(generalIndex)}`
      : `ForeignAsset #${Number(generalIndex)} (parachain ${Number(
          asset.parachainId,
        )})`;
  }

  return {
    isLocal,
    isNative,
    isPalletAsset,
    assetId,
    symbol,
    decimals,
    label,
    version: getAssetKindVersion(assetKind),
  };
}

export function getAssetBalanceQuery(assetKind) {
  const { isLocal, isNative, isPalletAsset, assetId, assetIdLocation } =
    describeAssetKind(assetKind);

  // A spend whose reserve is another chain is paid over XCM; the balance is not
  // held by a pallet on this chain.
  if (!isLocal) {
    return null;
  }

  if (isNative) {
    return { pallet: "System", args: [] };
  }

  if (isPalletAsset) {
    return { pallet: "Assets", args: [assetId] };
  }

  if (assetIdLocation) {
    return { pallet: "ForeignAssets", args: [assetIdLocation] };
  }

  return null;
}

export function getAssetMetadataQuery(assetKind) {
  const { isLocal, isNative, isPalletAsset, assetId, assetIdLocation } =
    describeAssetKind(assetKind);

  if (!isLocal || isNative) {
    return null;
  }

  if (isPalletAsset) {
    return { pallet: "Assets", args: [assetId] };
  }

  if (assetIdLocation) {
    return { pallet: "ForeignAssets", args: [assetIdLocation] };
  }

  return null;
}

export function getBalanceFromStorage(pallet, value) {
  if (!value) {
    return null;
  }

  if (pallet === "System") {
    return value.data?.free ?? null;
  }

  return value.balance ?? null;
}

export function formatPayoutAmount(amount, decimals = null) {
  if (isNil(amount) || isNil(decimals)) {
    return null;
  }

  const precision = Number(decimals);
  if (!Number.isFinite(precision)) {
    return null;
  }

  try {
    return BigNumber(amount).dividedBy(Math.pow(10, precision)).toString();
  } catch {
    return null;
  }
}

// `LocalPay` transfers from the treasury account, so a payout above the balance
// fails with `PayoutError` and only costs fees.
export function isPayoutBalanceInsufficient(treasuryBalance, amount) {
  if (isNil(treasuryBalance) || isNil(amount)) {
    return false;
  }

  try {
    return BigNumber(treasuryBalance).lt(amount);
  } catch {
    return false;
  }
}

export function getPayoutSpendTitle(post, index) {
  const title = post?.title?.trim?.();
  return title || `Treasury spend ${index}`;
}

function toNumberOrUndefined(value) {
  return isNil(value) ? undefined : Number(value);
}

export function getNextPayoutCountdown({
  validFrom,
  orderKey,
  expireAt,
  orderExpirationPeriod,
  latestHeight,
  blockTime,
}) {
  if (isNil(expireAt) || isNil(latestHeight)) {
    return null;
  }

  const now = Number(latestHeight);
  const blockMs = Number(blockTime) || 0;

  if (!isNil(validFrom) && Number(validFrom) > now) {
    const remainingBlocks = Number(validFrom) - now;
    const totalBlocks = Math.max(Number(validFrom) - Number(orderKey), 1);
    return {
      mode: "maturity",
      remainingBlocks,
      totalBlocks,
      remainingMs: remainingBlocks * blockMs,
      totalMs: totalBlocks * blockMs,
    };
  }

  const remainingBlocks = Math.max(Number(expireAt) - now, 0);
  const configPeriod = Number(orderExpirationPeriod);
  const totalBlocks =
    configPeriod > 0
      ? configPeriod
      : Math.max(Number(expireAt) - Number(orderKey), 1);

  return {
    mode: "lease",
    remainingBlocks,
    totalBlocks,
    remainingMs: remainingBlocks * blockMs,
    totalMs: totalBlocks * blockMs,
  };
}

export function buildPayoutQueue({
  assetKind,
  nextPayout,
  queue = [],
  spends = {},
  posts = {},
  treasuryBalance = null,
  capacity = null,
  orderExpirationPeriod = null,
  assetMeta = null,
  latestHeight,
  chainSymbol,
  chainDecimals,
}) {
  const info = getPapiAssetKindInfo(assetKind, {
    chainSymbol,
    chainDecimals,
  });
  const decimals = isNil(assetMeta?.decimals)
    ? info.decimals
    : Number(assetMeta.decimals);
  const symbol = assetMeta?.symbol ?? info.symbol;
  const now = isNil(latestHeight) ? null : Number(latestHeight);

  const formatSpendItem = (index, orderKey) => {
    const spend = spends[index];
    const spendExpireAt = toNumberOrUndefined(
      spend?.expire_at ?? spend?.expireAt,
    );
    return {
      index,
      status: getPayoutSpendStatus(spend?.status),
      title: getPayoutSpendTitle(posts[index], index),
      amount: formatPayoutAmount(spend?.amount, decimals),
      // Block at which the spend becomes payable / took its place in the order
      orderKey: toNumberOrUndefined(orderKey),
      // SpendStatus.expire_at: when the spend itself can no longer be paid
      spendExpireAt,
      // A queued spend can expire before it reaches the head; it then occupies
      // a queue slot but can never be paid.
      expired: !isNil(now) && !isNil(spendExpireAt) && spendExpireAt <= now,
    };
  };

  const headIndex = nextPayout?.[0];
  const nextPayoutSpend = isNil(headIndex)
    ? null
    : {
        ...formatSpendItem(headIndex, nextPayout?.[1]),
        // Countdown inputs, resolved against the latest height by the UI
        validFrom: toNumberOrUndefined(
          spends[headIndex]?.valid_from ?? spends[headIndex]?.validFrom,
        ),
        // NextPayout[2]: when the spend's position as head expires
        expireAt: toNumberOrUndefined(nextPayout?.[2]),
        orderExpirationPeriod: toNumberOrUndefined(orderExpirationPeriod),
      };

  // A head and queue snapshot taken from different blocks can briefly contain
  // the same spend in both; the head always wins.
  const waitingQueue = (queue ?? [])
    .filter(([index]) => !isNil(index) && index !== headIndex)
    .map(([index, orderKey]) => formatSpendItem(index, orderKey));

  const payable = [nextPayoutSpend, ...waitingQueue].filter(
    (item) => item && !item.expired && !isNil(item.amount),
  );
  const toBePaid = payable.length
    ? payable
        .map((item) => BigNumber(item.amount))
        .reduce((total, amount) => total.plus(amount), BigNumber(0))
        .toString()
    : null;

  return {
    key: getAssetKindKey(assetKind),
    symbol,
    assetKind: info.label,
    version: info.version,
    capacity,
    treasuryBalance,
    nextPayout: nextPayoutSpend,
    queue: waitingQueue,
    toBePaid,
  };
}

// The same asset can be queued under more than one XCM version until
// polkadot-sdk#13461 canonicalizes the asset kind, so tab ids must stay unique
function assignQueueIds(queues) {
  const symbolCounts = new Map();
  queues.forEach(({ symbol }) =>
    symbolCounts.set(symbol, (symbolCounts.get(symbol) ?? 0) + 1),
  );

  const usedIds = new Set();
  return queues.map((queue, index) => {
    const suffix =
      symbolCounts.get(queue.symbol) > 1 && queue.version
        ? queue.version
        : null;
    let id = `${queue.symbol}${suffix ? `-${suffix}` : ""}`;
    if (usedIds.has(id)) {
      id = `${id}-${index + 1}`;
    }
    usedIds.add(id);

    return {
      ...queue,
      id,
      label: suffix ? `${queue.symbol} (${suffix})` : queue.symbol,
      // The payout order is keyed by the raw versioned asset kind on chain, so
      // each encoding gets its own queue until the asset kind is canonicalized.
      tooltip: suffix
        ? `${queue.assetKind} · XCM ${suffix} encoding. The payout order is keyed by the encoded asset kind, so an equivalent encoding of the same asset gets its own queue and is not ordered against the others until polkadot-sdk#13461 canonicalizes it.`
        : queue.assetKind,
    };
  });
}

export function buildPayoutQueues({
  nextPayoutEntries = [],
  payoutQueueEntries = [],
  spends = {},
  posts = {},
  balances = {},
  assetMetas = {},
  capacity = null,
  orderExpirationPeriod = null,
  latestHeight,
  chainSymbol,
  chainDecimals,
}) {
  const kinds = new Map();

  const upsert = (entry, applyValue) => {
    const assetKind = getEntryAssetKind(entry);
    if (isNil(assetKind)) {
      return;
    }

    const key = getAssetKindKey(assetKind);
    const current = kinds.get(key) ?? {
      key,
      assetKind,
      nextPayout: null,
      queue: [],
    };
    applyValue(current, entry);
    kinds.set(key, current);
  };

  nextPayoutEntries.forEach((entry) =>
    upsert(entry, (current, item) => {
      current.nextPayout = Array.isArray(item?.value) ? item.value : null;
    }),
  );
  payoutQueueEntries.forEach((entry) =>
    upsert(entry, (current, item) => {
      current.queue = Array.isArray(item?.value) ? item.value : [];
    }),
  );

  const queues = [...kinds.values()]
    .map(({ key, assetKind, nextPayout, queue }) =>
      buildPayoutQueue({
        assetKind,
        nextPayout,
        queue,
        spends,
        posts,
        treasuryBalance: balances[key] ?? null,
        assetMeta: assetMetas[key] ?? null,
        capacity,
        orderExpirationPeriod,
        latestHeight,
        chainSymbol,
        chainDecimals,
      }),
    )
    .filter((item) => item.nextPayout || item.queue.length);

  return assignQueueIds(queues);
}
