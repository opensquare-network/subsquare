import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import WindowSizeProvider from "next-common/context/windowSize";
import UserAccountProvider from "next-common/context/user/account";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import VotesPowerPanel from "./votesPower";
import { AccountInfoPanel } from "next-common/components/profile/OpenGovBio";
import AssetInfo from "next-common/components/profile/OpenGovBio/openGovAssetInfo";
import DelegationGuidanceProvider from "next-common/components/profile/delegationGuidance/context/delegationGuidanceContext";
import dynamic from "next/dynamic";

const DelegationGuidance = dynamic(
  () => import("next-common/components/profile/delegationGuidance"),
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
    <UserAccountProvider address={address}>
      <div
        className={cn(
          "grid gap-[16px]",
          isMobile ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        <AccountInfoPanel address={address} id={id} user={user} />
        <VotesPowerPanel address={address} />
      </div>
      <AssetInfo address={address} />
      <DelegationGuidanceProvider pallet="democracy">
        <DelegationGuidance />
      </DelegationGuidanceProvider>
    </UserAccountProvider>
  );
}

export default function DemocracyBio() {
  return (
    <WindowSizeProvider>
      <DemocracyBioContent />
    </WindowSizeProvider>
  );
}
