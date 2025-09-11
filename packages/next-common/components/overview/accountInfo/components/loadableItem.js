import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";

export default function LoadableItem({
  title,
  value,
  isLoading = false,
  className,
  titleClassName,
  valueClassName,
}) {
  const { symbol, decimals } = useChainSettings();

  return (
    <div className={cn("flex flex-col grow", className)}>
      <span
        className={cn("text-textTertiary text12Medium mb-1", titleClassName)}
      >
        {title}
      </span>
      <LoadableContent isLoading={isLoading}>
        <div className={cn("text-textPrimary text16Bold", valueClassName)}>
          <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
        </div>
      </LoadableContent>
    </div>
  );
}
