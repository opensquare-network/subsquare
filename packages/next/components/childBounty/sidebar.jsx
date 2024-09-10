import ChildBountyClaim from "next-common/components/treasury/childBounty/claim";
import Meta from "next-common/components/treasury/childBounty/metadata";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";

export default function ChildBountySidebar() {
  return (
    <RightBarWrapper>
      <Meta />
      <ChildBountyClaim />
    </RightBarWrapper>
  );
}
