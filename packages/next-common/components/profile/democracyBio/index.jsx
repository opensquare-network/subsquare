import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import WindowSizeProvider from "next-common/context/windowSize";
import UserAccountProvider from "next-common/context/user/account";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import VotesPowerPanel from "./votesPower";
import RightPanelContainer from "next-common/components/profile/bio/rightPanelContainer";
import AssetInfo from "next-common/components/profile/bio/assetInfo";
import DelegationGuideProvider from "next-common/components/profile/delegationGuide/context/delegationGuideContext";
import dynamic from "next/dynamic";
import AccountInfoPanel from "next-common/components/profile/bio/accountInfoPanel";

const DelegationGuide = dynamic(
  () => import("next-common/components/profile/delegationGuide"),
  {
    ssr: false,
  },
);

function DemocracyBioContent() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  return (
    <>
      <div
        className={cn(
          "grid gap-[16px]",
          isMobile ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        <AccountInfoPanel address={address} id={id} user={user} />
        <RightPanelContainer>
          <UserAccountProvider address={address}>
            <AssetInfo address={address} />
          </UserAccountProvider>
          <VotesPowerPanel address={address} />
        </RightPanelContainer>
      </div>
      <DelegationGuideProvider pallet="democracy">
        <DelegationGuide />
      </DelegationGuideProvider>
    </>
  );
}

export default function DemocracyBio() {
  return (
    <WindowSizeProvider>
      <DemocracyBioContent />
    </WindowSizeProvider>
  );
}
