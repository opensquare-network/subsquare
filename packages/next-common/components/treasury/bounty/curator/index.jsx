import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { useCurator } from "next-common/context/treasury/bounties";
import { memo } from "react";
import CuratorTitle from "./curatorTitle";
import AccountDisplay from "./accountDisplay";

const CuratorContent = memo(function CuratorContent({ address }) {
  return (
    <SecondaryCardDetail>
      <CuratorTitle address={address} />
      <AccountDisplay address={address} borderBottom />
    </SecondaryCardDetail>
  );
});

function BountySidebarCurator() {
  const curator = useCurator();

  if (!curator) {
    return null;
  }

  return <CuratorContent address={curator} />;
}

export default BountySidebarCurator;
