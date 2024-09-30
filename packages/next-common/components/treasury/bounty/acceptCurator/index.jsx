import { useOnchainData } from "next-common/context/post";
import BountyAcceptCuratorButton from "./button";

export default function BountyAcceptCurator() {
  const onchainData = useOnchainData();

  return <BountyAcceptCuratorButton params={[onchainData.bountyIndex]} />;
}
