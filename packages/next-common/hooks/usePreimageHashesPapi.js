import { useMemo } from "react";
import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import { useContextPapiApi } from "next-common/context/papi";
import { useSelector } from "react-redux";
import { useAsync } from "react-use";
import { createCombinedHashes } from "./usePreimageHashesCommon";

const papiMethodMap = {
  statusFor: "StatusFor",
  requestStatusFor: "RequestStatusFor",
};

function normalizeVariantName(type) {
  if (!type) {
    return null;
  }

  return `${type.charAt(0).toLowerCase()}${type.slice(1)}`;
}

function normalizePrimitiveValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value.asHex === "function") {
    return value.asHex();
  }

  if (typeof value.toHex === "function") {
    return value.toHex();
  }

  if (typeof value.toJSON === "function") {
    try {
      return normalizePapiValue(value.toJSON());
    } catch {
      // Fall through to string conversion.
    }
  }

  if (typeof value.toString === "function") {
    const stringifiedValue = value.toString();
    if (stringifiedValue !== "[object Object]") {
      return stringifiedValue;
    }
  }

  return value;
}

function normalizePapiValue(value) {
  const primitiveValue = normalizePrimitiveValue(value);
  if (primitiveValue !== value) {
    return primitiveValue;
  }

  if (Array.isArray(value)) {
    return value.map(normalizePapiValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      normalizePapiValue(entryValue),
    ]),
  );
}

function normalizeTupleValue(value) {
  const normalizedValue = normalizePapiValue(value);
  return Array.isArray(normalizedValue) ? normalizedValue : [];
}

function normalizePapiStatus(method, status) {
  if (!status) {
    return null;
  }

  const statusName = normalizeVariantName(status.type);
  if (!statusName) {
    return normalizePapiValue(status);
  }

  const normalizedValue = normalizePapiValue(status.value ?? {});
  const deposit =
    method === "statusFor" ? normalizeTupleValue(normalizedValue.deposit) : [];
  const ticket =
    method === "requestStatusFor"
      ? normalizeTupleValue(
          normalizedValue.ticket ??
            normalizedValue.maybeTicket ??
            normalizedValue.maybe_ticket,
        )
      : [];

  return {
    [statusName]: {
      ...normalizedValue,
      deposit,
      ticket,
    },
  };
}

function normalizePapiHash(value) {
  const normalizedValue = normalizePrimitiveValue(value);
  return typeof normalizedValue === "string"
    ? normalizedValue
    : String(normalizedValue);
}

export function usePapiPreimageHashesCommon(method) {
  const trigger = useSelector(preImagesTriggerSelector);
  const papi = useContextPapiApi();

  const { value: hashes, loading } = useAsync(async () => {
    if (!papi) {
      return null;
    }

    const storageName = papiMethodMap[method];
    const entries = await papi?.query?.Preimage?.[storageName]?.getEntries?.();

    return (entries || []).map(({ keyArgs, value }) => [
      normalizePapiHash(keyArgs?.[0]),
      normalizePapiStatus(method, value),
    ]);
  }, [papi, trigger, method]);

  return {
    hashes: hashes || [],
    loading: !papi || loading,
  };
}

export function useOldPreimageHashesPapi() {
  return usePapiPreimageHashesCommon("statusFor");
}

export function usePreimageHashesPapi() {
  return usePapiPreimageHashesCommon("requestStatusFor");
}

export function useCombinedPreimageHashesPapi() {
  const { hashes: oldHashes, loading: oldLoading } = useOldPreimageHashesPapi();
  const { hashes: newHashes, loading: newLoading } = usePreimageHashesPapi();

  return {
    hashes: useMemo(
      () => createCombinedHashes(oldHashes, newHashes),
      [oldHashes, newHashes],
    ),
    loading: oldLoading || newLoading,
  };
}
