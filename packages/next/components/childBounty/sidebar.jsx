import ChildBountyClaim from "next-common/components/treasury/childBounty/claim";
import Meta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePostState } from "next-common/context/post";
import ChildBountySidebarBalance from "next-common/components/treasury/childBounty/balance";

export default function ChildBountySidebar() {
  const state = usePostState();
  const isClaimable = ["PendingPayout", "Claimed"].includes(state);

  return (
    <RightBarWrapper>
      <ChildBountySidebarBalance />
      {isClaimable && (
        <>
          <Meta />
          <ChildBountyClaim />
        </>
      )}
    </RightBarWrapper>
  );
}
