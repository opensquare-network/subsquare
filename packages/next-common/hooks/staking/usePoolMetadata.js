import useSubStorage from "next-common/hooks/common/useSubStorage";
import { u8aToString } from "@polkadot/util";

function decodePoolName(metadata) {
  // The `metadata` storage value is decoded by polkadot-js into a `Bytes`,
  // whose bare bytes are the UTF-8 encoded name, without the SCALE compact
  // length prefix.
  const bytes = metadata?.toU8a?.(true);

  return bytes?.length ? u8aToString(bytes) : "";
}

export function usePoolMetadata(poolId) {
  const { result: metadata, loading } = useSubStorage(
    "nominationPools",
    "metadata",
    [poolId],
  );

  return { name: decodePoolName(metadata), loading };
}
