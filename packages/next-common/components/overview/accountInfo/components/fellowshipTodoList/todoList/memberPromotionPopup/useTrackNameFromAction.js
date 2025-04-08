import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import getFastPromoteTrackNameFromRank from "./getFastPromoteTrackNameFromRank";

export default function useTrackNameFromAction(action, currentMemberRank) {
  const chain = useChain();
  if (action === "approve") {
    return getRetainTrackNameFromRank(chain, currentMemberRank);
  } else if (action === "promote") {
    return getPromoteTrackNameFromRank(chain, currentMemberRank + 1);
  } else if (action === "promoteFast") {
    return getFastPromoteTrackNameFromRank(chain, currentMemberRank + 1);
  }

  throw new Error("Unsupported action");
}
