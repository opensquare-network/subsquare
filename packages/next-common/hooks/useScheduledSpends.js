import { useEffect, useRef, useState } from "react";
import { useContextPapi } from "next-common/context/papi";
import {
  getDynamicBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders";
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";

// ─── Call identification (papi raw decoded format) ───────────────────────────
// Papi dynamic builder decodes RuntimeCall as:
//   { type: "PalletName", value: { type: "call_name", value: { ...args } } }
// Field names in args match the Rust metadata snake_case names.

function isSpendAssetCall(decoded) {
  return decoded?.type === "Treasury" && decoded?.value?.type === "spend";
}

function isSpendLocalCall(decoded) {
  return decoded?.type === "Treasury" && decoded?.value?.type === "spend_local";
}

function extractSpendAssetInfo(decoded) {
  const args = decoded.value.value;
  return {
    isSpendLocal: false,
    assetKind: args.asset_kind,
    amount: args.amount.toString(),
    beneficiary: args.beneficiary,
    validFrom: args.valid_from === undefined ? null : Number(args.valid_from),
  };
}

function extractSpendLocalInfo(decoded) {
  const args = decoded.value.value;
  return {
    isSpendLocal: true,
    amount: args.amount.toString(),
    beneficiary: args.beneficiary,
  };
}

/**
 * Recursively walk a papi-decoded RuntimeCall and collect all treasury spend
 * calls.  Unwraps: utility.batch/batch_all/force_batch, proxy.proxy, sudo.sudo,
 * and all scheduler.schedule* variants (inner call is always the `call` field).
 */
function collectSpends(decoded, depth = 0) {
  const results = [];

  function traverse(decoded, depth) {
    if (!decoded?.type || decoded.value === undefined || depth > 20) return;

    const palletType = decoded.type;
    const inner = decoded.value; // { type: callName, value: args }
    if (!inner?.type) return;

    const callName = inner.type;
    const args = inner.value;

    if (isSpendAssetCall(decoded)) {
      results.push(extractSpendAssetInfo(decoded));
    } else if (isSpendLocalCall(decoded)) {
      results.push(extractSpendLocalInfo(decoded));
    }

    if (
      palletType === "Utility" &&
      (callName === "batch" ||
        callName === "batch_all" ||
        callName === "force_batch")
    ) {
      for (const call of args?.calls ?? []) traverse(call, depth + 1);
    } else if (palletType === "Proxy" && callName === "proxy") {
      traverse(args?.call, depth + 1);
    } else if (palletType === "Sudo" && callName === "sudo") {
      traverse(args?.call, depth + 1);
    } else if (
      palletType === "Scheduler" &&
      (callName === "schedule" ||
        callName === "schedule_named" ||
        callName === "schedule_after" ||
        callName === "schedule_named_after")
    ) {
      traverse(args?.call, depth + 1);
    }
  }

  traverse(decoded, depth);
  return results;
}

// ─── Metadata + codec cache ───────────────────────────────────────────────────

async function buildCallCodec(client, blockHash) {
  const metadataRaw = await client._request(
    "state_getMetadata",
    blockHash ? [blockHash] : [],
  );
  const metadata = unifyMetadata(metadataCodec.dec(metadataRaw));
  const lookup = getLookupFn(metadata);
  const dynamicBuilder = getDynamicBuilder(lookup);
  return dynamicBuilder.buildDefinition(lookup.call);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useScheduledSpends(agendas, agendasLoading) {
  const { api, client, blockHash } = useContextPapi();

  // Cache the call codec keyed by blockHash so it is only built once.
  const codecCacheRef = useRef(null); // { key: blockHash|null, codec }

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agendasLoading || !client || !api) return;

    let cancelled = false;

    async function process() {
      // Build (or reuse) the call codec.
      const cacheKey = blockHash ?? null;
      if (!codecCacheRef.current || codecCacheRef.current.key !== cacheKey) {
        const codec = await buildCallCodec(client, blockHash);
        codecCacheRef.current = { key: cacheKey, codec };
      }
      const callCodec = codecCacheRef.current.codec;

      const results = [];

      for (const entry of agendas) {
        const { call, blockNumber } = entry;
        if (!call) continue;

        let callBytes = null;

        if (call.type === "Inline") {
          callBytes = call.value;
        } else if (call.type === "Lookup") {
          const { hash, len } = call.value;
          try {
            const preimage = await api.query.Preimage.PreimageFor.getValue([
              hash,
              len,
            ]);
            if (preimage) callBytes = preimage;
          } catch (e) {
            console.error(
              "useScheduledSpends: failed to fetch preimage",
              hash,
              e,
            );
          }
        }

        if (!callBytes) continue;

        try {
          const decoded = callCodec.dec(callBytes);
          for (const spend of collectSpends(decoded)) {
            results.push({ ...spend, scheduledBlock: blockNumber });
          }
        } catch (e) {
          console.error("useScheduledSpends: failed to decode call", e);
        }
      }

      if (!cancelled) {
        setData(results);
        setLoading(false);
      }
    }

    setLoading(true);
    process().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [agendas, agendasLoading, api, client, blockHash]);

  return {
    /** Full list of extracted treasury spends across all scheduler entries. */
    data,
    /** Total number of scheduled spends found. */
    count: data.length,
    loading: loading || agendasLoading,
  };
}
