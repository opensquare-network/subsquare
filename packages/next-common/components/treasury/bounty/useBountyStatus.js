import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useBountyStatus(bountyIndex) {
  const { result, loading } = useSubStorage("bounties", "bounties", [
    bountyIndex,
  ]);
  if (loading || result?.isNone) {
    return null;
  }
  const { status } = result?.unwrap?.() || {};
  return status;
}
