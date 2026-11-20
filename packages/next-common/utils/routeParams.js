// Each detail page owns the shape of the ids it serves: treasury proposals are numeric,
// externals are `<blockHeight>_<hash>`, and so on. A page declares that shape through
// `withCommonProps(handler, { validateParams: { id: isNumericId } })`, and every other url
// is answered as a missing page before the page runs a backend query with it.

export function isNumericId(value) {
  return /^\d+$/.test(value);
}

// Numeric segments joined by `_`: a child bounty is `42`, `13_0` or `13_0_1234567`,
// depending on how much of its parent/index/height the url carries.
export function isNumericSegmentsId(value) {
  return /^\d+(_\d+)*$/.test(value);
}

export function isBlockHashId(value) {
  return /^0x[0-9a-f]+$/i.test(value);
}

// The id of hashed on-chain posts and motions: /democracy/externals/123_0xab…,
// /treasury/tips/123_0xab…, /council/motions/123_0xab…
export function isBlockHeightHashId(value) {
  return /^\d+_0x[0-9a-f]+$/i.test(value);
}

export function isObjectId(value) {
  return /^[0-9a-f]{24}$/i.test(value);
}

// `1_dm`, `fellows`, `whitelisted_caller`, …: a track is addressed by its numeric id or
// by its on-chain name.
export function isTrackId(value) {
  return /^[a-z0-9][a-z0-9_]*$/i.test(value);
}

// `<blockHeight>_<cid>`, e.g. /alliance/announcements/1234_bafybeib…
export function isBlockHeightCidId(value) {
  return /^\d+_[a-z0-9]+$/i.test(value);
}

// A substrate address: base58 (ss58), or `0x…` hex on the evm-compatible chains.
export function isAddressId(value) {
  return /^(0x[0-9a-f]+|[1-9A-HJ-NP-Za-km-z]{40,64})$/i.test(value);
}

// A fellowship evidence id: a CID, a `<blockHeight>-<eventIndex>` pair, or a block height.
export function isEvidenceId(value) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(value);
}

export function anyOf(...validators) {
  return (value, context) =>
    validators.some((validator) =>
      matchesRouteParam(value, validator, context),
    );
}

function matchesRouteParam(value, validator, context) {
  if (Array.isArray(value)) {
    // A catch-all route hands over one entry per path segment.
    return (
      value.length > 0 &&
      value.every((item) => matchesRouteParam(item, validator, context))
    );
  }

  if (typeof value !== "string") {
    return false;
  }

  if (validator instanceof RegExp) {
    return validator.test(value);
  }

  return Boolean(validator(value, context));
}

export function matchesRouteParams(validateParams, params, context) {
  if (typeof validateParams === "function") {
    return Boolean(validateParams(params || {}, context));
  }

  return Object.entries(validateParams).every(([key, validator]) =>
    matchesRouteParam(params?.[key], validator, context),
  );
}
