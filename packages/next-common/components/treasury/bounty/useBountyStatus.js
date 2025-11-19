import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export function useBountyStatus(bountyIndex) {
  const api = useConditionalContextApi();
  const { result, loading } = useSubStorage(
    "bounties",
    "bounties",
    [bountyIndex],
    { api },
  );
  if (loading || result?.isNone) {
    return null;
  }
  const { status } = result?.unwrap?.() || {};
  return status;
}
