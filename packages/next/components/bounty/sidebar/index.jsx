import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarBalance from "./balance";
import BountySidebarCurator from "./curator";

function BountySidebar() {
  const { address } = useOnchainData();

  if (!address) {
    return null;
  }

  return (
    <RightBarWrapper>
      <BountySidebarBalance />
      <BountySidebarCurator curator={""}/>
    </RightBarWrapper>
  );
}

export default BountySidebar;
