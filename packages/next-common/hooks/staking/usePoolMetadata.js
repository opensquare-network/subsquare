import useSubStorage from "../common/useSubStorage";

export function usePoolMetadata(poolId) {
  const { result, loading } = useSubStorage("nominationPools", "metadata", [
    poolId,
  ]);
  const maybeHex = result?.toJSON();
  let name = maybeHex;
  if (maybeHex && maybeHex.startsWith("0x")) {
    name = Buffer.from(maybeHex.replace(/^0x/, ""), "hex").toString("utf8");
  }
  return {
    metadata: name,
    loading,
  };
}
