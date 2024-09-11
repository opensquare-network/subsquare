import ChildBountyClaim from "next-common/components/treasury/childBounty/claim";
import Meta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePostState } from "next-common/context/post";

export default function ChildBountySidebar() {
  const state = usePostState();
  if (!["PendingPayout", "Claimed"].includes(state)) {
    return null;
  }

  return (
    <RightBarWrapper>
      <Meta />
      <ChildBountyClaim />
    </RightBarWrapper>
  );
}
