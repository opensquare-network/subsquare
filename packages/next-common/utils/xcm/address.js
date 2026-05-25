import { encodeAddressToChain } from "next-common/services/address";

function getVersionedValue(value) {
  return value?.value || value?.v5 || value?.v4 || value?.v3 || value;
}

function getLocationJunctions(location) {
  const interior = location?.interior;
  if (!interior) {
    return [];
  }

  if (interior === "here" || interior.here !== undefined) {
    return [];
  }

  const junctionKey = Object.keys(interior).find((key) => /^x\d+$/i.test(key));
  if (!junctionKey) {
    return [];
  }

  const junctions = interior[junctionKey];
  return Array.isArray(junctions) ? junctions : [junctions];
}

function getJunctionAccount(junction, type) {
  return junction?.[type] || junction?.[type[0].toUpperCase() + type.slice(1)];
}

function getAddressFromAccountId32(accountId32, chain) {
  const publicKey = accountId32?.id || accountId32;
  if (!publicKey) {
    return null;
  }

  return encodeAddressToChain(publicKey, chain) || null;
}

function getAddressFromAccountKey20(accountKey20) {
  return accountKey20?.key || accountKey20?.id || accountKey20 || null;
}

export function extractAddressFromXcmAccountLocation(value, chain) {
  if (!value || typeof value === "string") {
    return value;
  }

  if (typeof value !== "object") {
    return null;
  }

  if (typeof value.address === "string") {
    return value.address;
  }

  const versionedValue = getVersionedValue(value);
  const location = versionedValue?.accountId || versionedValue;
  const junctions = getLocationJunctions(location);

  for (const junction of junctions) {
    const accountId32 = getJunctionAccount(junction, "accountId32");
    if (accountId32) {
      return getAddressFromAccountId32(accountId32, chain);
    }

    const accountKey20 = getJunctionAccount(junction, "accountKey20");
    if (accountKey20) {
      return getAddressFromAccountKey20(accountKey20);
    }
  }

  return null;
}
