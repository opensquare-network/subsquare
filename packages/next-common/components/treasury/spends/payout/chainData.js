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

export function getPayoutSpendStatus(status) {
  const type = typeof status === "string" ? status : status?.type;
  return SPEND_STATUSES.includes(type) ? type : null;
}

export function getPayoutActionLabel(status) {
  const normalized = getPayoutSpendStatus(status);
  return normalized ? ACTION_LABELS[normalized] : null;
}

// The pallet only pays the `NextPayout` head; it rejects an un-matured head
// (`EarlyPayout`), an already expired spend (`SpendExpired`) and a head whose
// order expired while another queued spend is already mature (`NotNextPayout`).
export function getNextPayoutAction({
  status,
  validFrom,
  expireAt,
  spendExpireAt,
  firstQueuedOrderKey,
  latestHeight,
}) {
  const normalized = getPayoutSpendStatus(status);
  if (!normalized) {
    return null;
  }

  if (normalized === "Attempted") {
    return {
      kind: "checkStatus",
      label: ACTION_LABELS.Attempted,
      call: "checkStatus",
    };
  }

  const hasHeight = !isNil(latestHeight);
  const now = Number(latestHeight);

  if (hasHeight && !isNil(validFrom) && Number(validFrom) > now) {
    return { kind: "wait", label: ACTION_LABELS[normalized], call: null };
  }

  if (hasHeight && !isNil(spendExpireAt) && Number(spendExpireAt) <= now) {
    return EXPIRED_ACTION;
  }

  const leaseExpired = hasHeight && !isNil(expireAt) && Number(expireAt) < now;
  const nextSpendMature =
    hasHeight &&
    !isNil(firstQueuedOrderKey) &&
    Number(firstQueuedOrderKey) <= now;

  if (leaseExpired && nextSpendMature) {
    return ROTATE_ACTION;
  }

  return {
    kind: "payout",
    label: ACTION_LABELS[normalized],
    call: "payout",
  };
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

function parsePapiAssetKind(assetKind) {
  const inner = assetKind?.value ?? assetKind;
  const assetIdLocation = getAssetIdLocation(inner?.asset_id ?? inner?.assetId);
  const junctions = getJunctions(assetIdLocation?.interior) ?? [];

  return { assetIdLocation, junctions };
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
  const { junctions } = parsePapiAssetKind(assetKind);
  const isNative = junctions.length === 0;
  const palletInstance = findJunctionValue(junctions, "PalletInstance");
  const generalIndex = findJunctionValue(junctions, "GeneralIndex");
  const isPalletAsset =
    Number(palletInstance) === ASSET_HUB_PALLET_INSTANCE &&
    !isNil(generalIndex);
  const assetId = isPalletAsset ? Number(generalIndex) : null;
  const knownSymbol = isPalletAsset
    ? ASSET_HUB_GENERAL_INDEX_SYMBOL[String(assetId)] ?? null
    : null;

  let symbol = chainSymbol;
  let label = "Asset";
  if (isNative) {
    label = "Native";
  } else if (isPalletAsset) {
    symbol = knownSymbol ?? `#${assetId}`;
    label = `ForeignAsset #${assetId}`;
  } else if (!isNil(generalIndex)) {
    symbol = `#${Number(generalIndex)}`;
    label = `ForeignAsset #${Number(generalIndex)}`;
  }

  const decimals =
    (knownSymbol ? SYMBOL_DECIMALS[knownSymbol] : undefined) ?? chainDecimals;

  return {
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
  const { assetIdLocation, junctions } = parsePapiAssetKind(assetKind);

  if (junctions.length === 0) {
    return { pallet: "System", args: [] };
  }

  const palletInstance = findJunctionValue(junctions, "PalletInstance");
  const generalIndex = findJunctionValue(junctions, "GeneralIndex");
  if (
    Number(palletInstance) === ASSET_HUB_PALLET_INSTANCE &&
    !isNil(generalIndex)
  ) {
    return { pallet: "Assets", args: [Number(generalIndex)] };
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

export function formatPayoutAmount(amount, decimals = 0) {
  if (isNil(amount)) {
    return null;
  }

  try {
    return BigNumber(amount).dividedBy(Math.pow(10, decimals)).toString();
  } catch {
    return null;
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
  chainSymbol,
  chainDecimals,
}) {
  const info = getPapiAssetKindInfo(assetKind, {
    chainSymbol,
    chainDecimals,
  });

  const formatSpendItem = (index, orderKey) => {
    const spend = spends[index];
    return {
      index,
      status: getPayoutSpendStatus(spend?.status),
      title: getPayoutSpendTitle(posts[index], index),
      amount: formatPayoutAmount(spend?.amount, info.decimals),
      // Block at which the spend becomes payable / took its place in the order
      orderKey: toNumberOrUndefined(orderKey),
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
        // SpendStatus.expire_at: when the spend itself can no longer be paid
        spendExpireAt: toNumberOrUndefined(
          spends[headIndex]?.expire_at ?? spends[headIndex]?.expireAt,
        ),
        orderExpirationPeriod: toNumberOrUndefined(orderExpirationPeriod),
      };

  const waitingQueue = (queue ?? [])
    .map(([index, orderKey]) => formatSpendItem(index, orderKey))
    .filter((item) => !isNil(item.index));

  const amounts = [
    nextPayoutSpend?.amount,
    ...waitingQueue.map((i) => i.amount),
  ]
    .filter((amount) => !isNil(amount))
    .map((amount) => BigNumber(amount));
  const toBePaid = amounts.length
    ? amounts
        .reduce((total, amount) => total.plus(amount), BigNumber(0))
        .toString()
    : null;

  return {
    key: getAssetKindKey(assetKind),
    symbol: info.symbol,
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
    };
  });
}

export function buildPayoutQueues({
  nextPayoutEntries = [],
  payoutQueueEntries = [],
  spends = {},
  posts = {},
  balances = {},
  capacity = null,
  orderExpirationPeriod = null,
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
        capacity,
        orderExpirationPeriod,
        chainSymbol,
        chainDecimals,
      }),
    )
    .filter((item) => item.nextPayout || item.queue.length);

  return assignQueueIds(queues);
}
