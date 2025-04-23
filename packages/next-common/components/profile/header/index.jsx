import { useTheme } from "styled-components";
import { cn } from "next-common/utils";
import { DisplayUserAvatar } from "../bio";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import EditAvatarIconButton from "next-common/components/editAvatarIconButton";
import AvatarPermissionsProvider, {
  useAvatarPermissionsContext,
} from "next-common/components/profile/header/context/avatarPermissionsContext";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useUser } from "next-common/context/user";
import { useState } from "react";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";

const ProfileBannerEditPopup = dynamicPopup(
  () => import("next-common/components/profileBannerEditPopup"),
  {
    ssr: false,
  },
);

export function useProfileBannerUrl() {
  const { isDark } = useTheme();
  const user = useUser();
  const filename = `imgBannerProfile${isDark ? "Dark" : "Light"}.webp`;

  let defaultBannerUrl = `https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/banner/${filename}`;

  if (user?.bannerCid) {
    defaultBannerUrl = getIpfsLink(user.bannerCid);
  }

  return defaultBannerUrl;
}

function ProfileHeaderWithBannerInContext() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const [isEditBannerPopupOpen, setIsEditBannerPopupOpen] = useState(false);
  const { isSelf, isProxyAccount } = useAvatarPermissionsContext();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;
  const bannerUrl = useProfileBannerUrl();

  return (
    <div
      className={cn("bg-no-repeat bg-cover", "w-full h-[120px] relative")}
      style={{ backgroundImage: `url(${bannerUrl})` }}
    >
      <div
        className={cn(
          "px-12 mx-auto max-w-[1200px] max-sm:px-6 relative top-[72px] flex justify-between",
          isMobile && "flex justify-center",
        )}
      >
        <div className="w-[96px] h-[96px] rounded-[100px] border border-neutral300 bg-neutral100 relative">
          <DisplayUserAvatar address={address} size={94} />
          {(isSelf || isProxyAccount) && <EditAvatarIconButton />}
        </div>

        {(isSelf || isProxyAccount) && (
          <SecondaryButton
            className={cn("self-start -mt-[56px]", {
              "absolute right-6": isMobile,
            })}
            size={isMobile ? "small" : "medium"}
            onClick={() => setIsEditBannerPopupOpen(true)}
          >
            Edit Banner
          </SecondaryButton>
        )}
      </div>
      {isEditBannerPopupOpen && (
        <ProfileBannerEditPopup
          onClose={() => setIsEditBannerPopupOpen(false)}
        />
      )}
    </div>
  );
}

export default function ProfileHeaderWithBanner() {
  return (
    <AvatarPermissionsProvider>
      <ProfileHeaderWithBannerInContext />
    </AvatarPermissionsProvider>
  );
}
