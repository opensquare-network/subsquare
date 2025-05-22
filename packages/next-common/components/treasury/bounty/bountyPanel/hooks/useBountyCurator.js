import { useBountyStatus } from "next-common/components/treasury/bounty/useBountyStatus";

function useBountyCurator(bountyIndex) {
  const status = useBountyStatus(bountyIndex);
  if (status?.isActive) {
    return status.asActive.curator.toString();
  }
  if (status?.isPendingPayout) {
    return status.asPendingPayout.curator.toString();
  }
  return null;
}

export default useBountyCurator;
