import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";
import Tooltip from "next-common/components/tooltip";

export default function LoadableItem({
  title,
  value,
  isLoading = false,
  className,
  titleClassName,
  valueClassName,
  tooltipContent,
}) {
  const { symbol, decimals } = useChainSettings();

  return (
    <div className={cn("flex flex-col grow", className)}>
      <span
        className={cn(
          "text-textTertiary text12Medium mb-1 whitespace-nowrap",
          titleClassName,
        )}
      >
        {title}
      </span>
      <div className={cn("text-textPrimary text16Bold", valueClassName)}>
        <LoadableContent size={16} isLoading={isLoading}>
          {tooltipContent ? (
            <Tooltip content={tooltipContent}>
              <ValueDisplay
                value={toPrecision(value, decimals)}
                symbol={symbol}
                showTooltip={false}
              />
            </Tooltip>
          ) : (
            <ValueDisplay
              value={toPrecision(value, decimals)}
              symbol={symbol}
            />
          )}
        </LoadableContent>
      </div>
    </div>
  );
}
