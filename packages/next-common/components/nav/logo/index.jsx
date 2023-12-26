import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";
import ChainLogoEventBackground from "./eventBackground";
import { cn } from "next-common/utils";

export default function ChainLogo({ className = "" }) {
  const chainSettings = useChainSettings();

  if (!chainSettings.navLogo || !chainSettings.navLogoDark) {
    return null;
  }

  // NOTE: workaround, should find some React way to check is same source
  const isDarkLogoOnLightMode =
    chainSettings.navLogo === chainSettings.navLogoDark;

  const logo =
    // check is same source
    isDarkLogoOnLightMode ? (
      <chainSettings.navLogo />
    ) : (
      <>
        <chainSettings.navLogo className="dark:hidden" />
        <chainSettings.navLogoDark className="hidden dark:block" />
      </>
    );

  return (
    <div className={cn("relative", className)}>
      <Link href="/" className="z-[1]">
        {logo}
      </Link>
      <ChainLogoEventBackground preferDark={isDarkLogoOnLightMode} />
    </div>
  );
}
