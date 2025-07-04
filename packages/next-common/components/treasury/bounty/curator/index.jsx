import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { useCurator } from "next-common/context/treasury/bounties";
import { useCuratorAddress } from "next-common/hooks/treasury/bounty/useCuratorInfo";
import { memo } from "react";
import CuratorTitle from "./curatorTitle";
import AccountDisplay from "./accountDisplay";
import CuratorLinks from "../links";
import ProxyAccounts from "./proxyAccounts";
import MultisigAccounts from "./multisigAccounts";

const CuratorContent = memo(function CuratorContent({ address }) {
  const { isPure, multisigData, proxies } = useCuratorAddress(address);

  return (
    <SecondaryCardDetail>
      <CuratorTitle address={address} />
      <div className="flex items-center flex-wrap  space-x-2 h-[44px] mt-0 border-b border-neutral300">
        <AccountDisplay
          address={address}
          isPure={isPure}
          badge={multisigData?.badge}
        />
      </div>
      <CuratorLinks address={address} showCouncilorLink={true} />
      <ProxyAccounts proxies={proxies} />
      <MultisigAccounts signatories={multisigData?.signatories} />
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
