import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import FellowshipTagInfo, {
  FellowshipTagInfoWrapper,
} from "../fellowshipTagInfo";
import { DisplayUserAvatar, DisplayUser, DisplayUserAddress } from "../bio";
import OpenGovAssetInfo from "./openGovAssetInfo";
import WindowSizeProvider from "next-common/context/windowSize";
import UserAccountProvider from "next-common/context/user/account";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";

function OpenGovBioContent() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;
  const shouldAlignCenter = isMobile || !address;

  return (
    <UserAccountProvider address={address}>
      <div
        className={cn(
          "w-full flex flex-col px-0 py-6 mt-0  gap-4",
          shouldAlignCenter ? "items-center" : "items-start",
        )}
      >
        <DisplayUserAvatar address={address} user={user} />
        <div
          className={cn(
            "flex mt-0 flex-wrap w-full",
            shouldAlignCenter ? "justify-center" : "justify-start",
          )}
        >
          <DisplayUser
            id={id}
            className={cn("flex", shouldAlignCenter ? "justify-center" : "")}
          />
          <DisplayUserAddress
            address={address}
            className={cn(
              shouldAlignCenter ? "!items-center" : "flex-1 !items-start",
            )}
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

          <OpenGovAssetInfo address={address} />
        </div>
      </div>
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
