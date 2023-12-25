import { useChainSettings } from "next-common/context/chain";
import Link from "next/link";
import ChainLogoChristmasEffects from "./christmasEffects";
import { cn } from "next-common/utils";

export default function ChainLogo({ className = "" }) {
  const chainSettings = useChainSettings();

  if (!chainSettings.navLogo || !chainSettings.navLogoDark) {
    return null;
  }

  // NOTE: workaround, should find some React way to check is same source
  const logo =
    // check is same source
    chainSettings.navLogo === chainSettings.navLogoDark ? (
      <chainSettings.navLogo />
    ) : (
      <>
        <chainSettings.navLogo className="dark:hidden" />
        <chainSettings.navLogoDark className="hidden dark:block" />
      </>
    );

  return (
    <div className={cn(className)}>
      <Link href="/" className="relative">
        <ChainLogoChristmasEffects />
        {logo}
      </Link>
    </div>
  );
}
