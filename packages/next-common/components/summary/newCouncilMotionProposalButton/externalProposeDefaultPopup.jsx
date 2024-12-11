import Chains from "next-common/utils/consts/chains";
import ExternalProposeVoteThresholdPopup from "./common/externalProposeVoteThresholdPopup";
import { useCollectivePallet } from "next-common/context/collective";
import { useChain } from "next-common/context/chain";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";

export default function ExternalProposeDefaultPopup({ isMember, onClose }) {
  const chain = useChain();
  const { members } = useCollectiveMembers();
  const pallet = useCollectivePallet();

  let threshold = null;
  if ([Chains.shibuya, Chains.astar].includes(chain) && pallet === "council") {
    threshold = members?.length;
  }

  return (
    <ExternalProposeVoteThresholdPopup
      method="externalProposeDefault"
      isMember={isMember}
      onClose={onClose}
      threshold={threshold}
    />
  );
}
