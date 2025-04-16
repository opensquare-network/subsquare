import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import getFastPromoteTrackNameFromRank from "./getFastPromoteTrackNameFromRank";

export default function useTrackNameFromAction(action, targetRank) {
  const chain = useChain();
  if (action === "approve") {
    return getRetainTrackNameFromRank(chain, targetRank);
  } else if (action === "promote") {
    return getPromoteTrackNameFromRank(chain, targetRank);
  } else if (action === "promoteFast") {
    return getFastPromoteTrackNameFromRank(chain, targetRank);
  }

  throw new Error("Unsupported action");
}
