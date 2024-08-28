import { cn } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";

export default function NetworkIcon({ chain, className = "" }) {
  if (chain === "assethub") {
    chain = Chains.polkadotAssetHub;
  }

  const { networkIcon: NetworkIcon, networkIconDark: NetworkIconDark } =
    getChainSettings(chain);

  if (!NetworkIcon) {
    return null;
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <NetworkIcon
        className={cn("w-full h-full", NetworkIconDark ? "dark:hidden" : "")}
      />
      {NetworkIconDark && <NetworkIconDark className="hidden dark:block" />}
    </div>
  );
}
