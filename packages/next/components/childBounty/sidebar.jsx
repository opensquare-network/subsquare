import ChildBountyClaim from "next-common/components/treasury/childBounty/claim";
import Meta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";

export default function ChildBountySidebar() {
  const onChain = useOnchainData();
  if (!["PendingPayout", "Claimed"].includes(onChain?.state?.state)) {
    return null;
  }

  return (
    <RightBarWrapper>
      <Meta />
      <ChildBountyClaim />
    </RightBarWrapper>
  );
}
