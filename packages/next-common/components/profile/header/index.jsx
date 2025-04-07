import { useTheme } from "styled-components";
import { cn } from "next-common/utils";
import { DisplayUserAvatar } from "../bio";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

function resolveBannersRepoFilepathUrl(filename) {
  return `https://cdn.jsdelivr.net/gh/opensquare-network/subsquare-static/banner/${filename}`;
}

export default function ProfileHeaderWithBanner() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const { user, id } = usePageProps();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;

  const imgSrc = resolveBannersRepoFilepathUrl(
    `imgBannerProfile${isDark ? "Dark" : "Light"}.webp`,
  );

  return (
    <div
      className={cn("bg-no-repeat bg-cover", "w-full h-[120px] relative")}
      style={{ backgroundImage: `url(${imgSrc})` }}
    >
      <div
        className={cn(
          "px-12 mx-auto max-w-[1200px] max-sm:px-6 relative top-[72px]",
          isMobile && "flex justify-center",
        )}
      >
        <DisplayUserAvatar address={address} user={user} size={96} />
      </div>
    </div>
  );
}
