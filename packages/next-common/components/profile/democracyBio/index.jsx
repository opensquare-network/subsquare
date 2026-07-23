import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { usePageProps } from "next-common/context/page";
import UserPapiAccountProvider from "next-common/context/user/papiAccount";
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

export default function DemocracyBio() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const address = useProfileAddress();

  return (
    <>
      <div
        className={cn(
          "px-6 grid gap-[16px]",
          isMobile ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        <AccountInfoPanel address={address} id={id} user={user} />
        <RightPanelContainer>
          <UserPapiAccountProvider address={address}>
            <AssetInfo address={address} />
            <VotesPowerPanel address={address} />
          </UserPapiAccountProvider>
        </RightPanelContainer>
      </div>
      <DelegationGuideProvider pallet="democracy">
        <DelegationGuide />
      </DelegationGuideProvider>
    </>
  );
}
