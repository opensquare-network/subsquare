import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import FellowshipTagInfo, {
  FellowshipTagInfoWrapper,
} from "../fellowshipTagInfo";
import { DisplayUser, DisplayUserAddress } from "../bio";
import AssetInfo from "next-common/components/profile/bio/assetInfo";
import WindowSizeProvider from "next-common/context/windowSize";
import UserAccountProvider from "next-common/context/user/account";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import VotesPowerPanel from "./votesPower";
import DelegationGuideProvider from "next-common/components/profile/delegationGuide/context/delegationGuideContext";
import dynamic from "next/dynamic";
import ReferendaDelegationProvider from "next-common/components/profile/delegationGuide/context/referendaDelegationContext";
import { VerticalDivider } from "next-common/components/styled/layout/divider";

const DelegationGuide = dynamic(
  () => import("next-common/components/profile/delegationGuide"),
  {
    ssr: false,
  },
);

const Relatives = dynamic(
  () => import("next-common/components/profile/relatives"),
  {
    ssr: false,
  },
);

export function AccountInfoPanel({ address, id }) {
  const isMobile = useIsMobile();
  const shouldAlignCenter = isMobile || !address;

  return (
    <div
      className={cn(
        "w-full flex px-0  mt-0 gap-4",
        shouldAlignCenter ? "flex-col items-center" : "flex-row items-start",
      )}
    >
      <div
        className={cn(
          "flex mt-0 flex-wrap w-full",
          shouldAlignCenter ? "justify-center" : "justify-start",
        )}
      >
        <DisplayUser
          id={id}
          className={cn(
            "flex text14Medium",
            shouldAlignCenter ? "justify-center" : "",
          )}
        />
        <DisplayUserAddress
          address={address}
          className={cn(
            shouldAlignCenter
              ? "!items-center text-center"
              : "flex-1 !items-start",
          )}
          extra={
            <>
              <VerticalDivider height={13} margin={16} />
              <Relatives />
            </>
          }
        />

        <FellowshipTagInfoWrapper>
          <FellowshipTagInfo address={address} />
        </FellowshipTagInfoWrapper>
        <FellowshipTagInfoWrapper>
          <FellowshipTagInfo
            address={address}
            pallet="ambassadorCollective"
            type="ambassador"
          />
        </FellowshipTagInfoWrapper>
      </div>
    </div>
  );
}

export function RightPanelContainer({ children }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "grid gap-[16px]",
        isMobile ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

function OpenGovBioContent() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  return (
    <UserAccountProvider address={address}>
      <div
        className={cn(
          "grid gap-[16px] grid-cols-2",
          isMobile ? "max-lg:grid-cols-1" : "max-md:grid-cols-1",
        )}
      >
        <AccountInfoPanel address={address} id={id} user={user} />
        <RightPanelContainer>
          <AssetInfo address={address} />
          <VotesPowerPanel address={address} />
        </RightPanelContainer>
      </div>
      <DelegationGuideProvider pallet="referenda">
        <ReferendaDelegationProvider>
          <DelegationGuide />
        </ReferendaDelegationProvider>
      </DelegationGuideProvider>
    </UserAccountProvider>
  );
}

export default function OpenGovBio() {
  return (
    <WindowSizeProvider>
      <OpenGovBioContent />
    </WindowSizeProvider>
  );
}
