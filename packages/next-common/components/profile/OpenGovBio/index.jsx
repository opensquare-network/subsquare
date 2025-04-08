import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import AssetInfo from "next-common/components/profile/bio/assetInfo";
import WindowSizeProvider from "next-common/context/windowSize";
import UserAccountProvider from "next-common/context/user/account";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import VotesPowerPanel from "./votesPower";
import DelegationGuideProvider from "next-common/components/profile/delegationGuide/context/delegationGuideContext";
import dynamic from "next/dynamic";
import ReferendaDelegationProvider from "next-common/components/profile/delegationGuide/context/referendaDelegationContext";
import AccountInfoPanel from "next-common/components/profile/bio/accountInfoPanel";
import RightPanelContainer from "next-common/components/profile/bio/rightPanelContainer";

const DelegationGuide = dynamic(
  () => import("next-common/components/profile/delegationGuide"),
  {
    ssr: false,
  },
);

function OpenGovBioContent() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2",
          isMobile ? "max-lg:grid-cols-1" : "max-md:grid-cols-1",
          address && "gap-[16px]",
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
      {address && (
        <DelegationGuideProvider pallet="referenda">
          <ReferendaDelegationProvider>
            <DelegationGuide />
          </ReferendaDelegationProvider>
        </DelegationGuideProvider>
      )}
    </>
  );
}

export default function OpenGovBio() {
  return (
    <WindowSizeProvider>
      <OpenGovBioContent />
    </WindowSizeProvider>
  );
}
