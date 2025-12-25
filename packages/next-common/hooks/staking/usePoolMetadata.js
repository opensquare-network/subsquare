import useSubStorage from "next-common/hooks/common/useSubStorage";
import {
  hexToU8a,
  isHex,
  compactStripLength,
  u8aToString,
} from "@polkadot/util";

function decodePoolName(input) {
  if (!input || !isHex(input)) {
    return input || "";
  }

  try {
    const bytes = hexToU8a(input);
    const [, stripped] = compactStripLength(bytes);
    return u8aToString(stripped);
  } catch (error) {
    console.error("Error decoding metadata:", error);
    return input;
  }
}

export function usePoolMetadata(poolId) {
  const { result: metadata, loading } = useSubStorage(
    "nominationPools",
    "metadata",
    [poolId],
  );

  return { name: decodePoolName(metadata?.toHex()), loading };
}
