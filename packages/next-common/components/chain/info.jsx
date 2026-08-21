import ChainIcon from "next-common/components/header/chainIcon";
import { cn } from "next-common/utils";
import { getChainSettingsPolyfill } from "next-common/utils/consts/settingsPolyfill";

export default function ChainInfo({
  chain,
  className = "",
  iconClassName = "",
}) {
  const { name } = getChainSettingsPolyfill(chain);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-x-1 text-textPrimary",
        className,
      )}
    >
      <ChainIcon className={iconClassName} chain={chain} />
      <span>{name}</span>
    </span>
  );
}
