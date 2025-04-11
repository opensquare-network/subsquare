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

export function useProfileBannerUrl() {
  const { isDark } = useTheme();
  const filename = `imgBannerProfile${isDark ? "Dark" : "Light"}.webp`;

  return `https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/banner/${filename}`;
}

function ProfileHeaderWithBannerInContext() {
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
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
          "px-12 mx-auto max-w-[1200px] max-sm:px-6 relative top-[72px]",
          isMobile && "flex justify-center",
        )}
      >
        <div className="w-[96px] h-[96px] rounded-[100px] border border-neutral300 bg-neutral100 relative">
          <DisplayUserAvatar address={address} size={94} />
          {(isSelf || isProxyAccount) && (
            <EditAvatarIconButton
              title={"Set Avatar" + (isProxyAccount ? " As Proxy" : "")}
            />
          )}
        </div>
      </div>
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
