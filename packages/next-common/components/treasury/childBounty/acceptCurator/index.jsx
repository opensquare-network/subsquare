import { useOnchainData } from "next-common/context/post";
import BountyAcceptCuratorButton from "../../bounty/acceptCurator/button";

export default function ChildBountyAcceptCurator() {
  const onchainData = useOnchainData();
  const { parentBountyId, index: childBountyId } = onchainData;

  return (
    <BountyAcceptCuratorButton
      pallet="childBounties"
      params={[parentBountyId, childBountyId]}
    />
  );
}
