import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { useCurator } from "next-common/context/treasury/bounties";
import { memo } from "react";
import CuratorTitle from "./curatorTitle";
import AccountSection from "./accountSection";

const CuratorContent = memo(function CuratorContent({ address }) {
  return (
    <SecondaryCardDetail>
      <CuratorTitle address={address} />
      <AccountSection address={address} borderBottom />
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
