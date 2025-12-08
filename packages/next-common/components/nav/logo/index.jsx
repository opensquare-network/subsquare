import { useChainSettings } from "next-common/context/chain";
import Link from "next-common/components/link";
import ChainLogoEventBackground from "./eventBackground";
import { cn } from "next-common/utils";

export default function ChainLogo({ className = "" }) {
  const chainSettings = useChainSettings();

  if (!chainSettings.navLogo || !chainSettings.navLogoDark) {
    return null;
  }

  const logo = chainSettings.navPreferDark ? (
    <chainSettings.navLogoDark />
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
      <ChainLogoEventBackground />
    </div>
  );
}
