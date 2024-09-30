import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "next-common/components/treasury/bounty/balance";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import BountyClaim from "next-common/components/treasury/bounty/claim";
import NewChildBountyButton from "next-common/components/treasury/bounty/newChildBountyButton";

function BountySidebar() {
  const { address } = useOnchainData();

  if (!address) {
    return null;
  }

  return (
    <RightBarWrapper>
      <BountySidebarBalance />
      <BountyClaim />
      <BountySidebarCurator />
      <NewChildBountyButton />
    </RightBarWrapper>
  );
}

export default BountySidebar;
