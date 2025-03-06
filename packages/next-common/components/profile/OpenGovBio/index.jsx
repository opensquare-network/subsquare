import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import FellowshipTagInfo from "../fellowshipTagInfo";
import { DisplayUserAvatar, DisplayUser, DisplayUserAddress } from "../bio";
import Divider from "next-common/components/styled/layout/divider";
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

  return (
    <UserAccountProvider address={address}>
      <div
        className={cn(
          "w-full flex flex-col px-0 py-6 mt-0  gap-4",
          isMobile ? "items-center" : "items-start",
        )}
      >
        <DisplayUserAvatar address={address} user={user} />
        <div
          className={cn(
            "flex-1 mt-0 flex-wrap w-full",
            isMobile ? "justify-center" : "justify-start",
          )}
        >
          <DisplayUser
            id={id}
            className={cn("flex", isMobile ? "justify-center" : "")}
          />
          <DisplayUserAddress
            address={address}
            className={cn(isMobile ? "!items-center" : "flex-1 !items-start")}
          />

          <FellowshipTagInfo address={address} />
          <FellowshipTagInfo
            address={address}
            pallet="ambassadorCollective"
            type="ambassador"
          />

          <Divider className="my-4 w-full" />

          <OpenGovAssetInfo />
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
