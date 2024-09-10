import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "next-common/components/treasury/bounty/balance";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import BountyClaim from "next-common/components/treasury/bounty/claim";

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
    </RightBarWrapper>
  );
}

export default BountySidebar;
