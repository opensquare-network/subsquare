import { cn } from "next-common/utils";
import Loading from "next-common/components/loading";
import LineChart from "./lineChart";
import { Wrap } from "./style";

export default function PriceCardContent({
  data = {},
  loading,
  className,
  titleSymbol,
}) {
  return (
    <Wrap className={cn("flex flex-col overflow-hidden gap-4", className)}>
      <div className="flex gap-1">
        <span className="text14Bold text-textPrimary">Token Supply</span>
        {titleSymbol && (
          <span className="text14Bold text-textTertiary">{titleSymbol}</span>
        )}
      </div>

      <div className={cn("relative", "mt-2")}>
        {loading ? (
          <div className={cn("h-[144px]", "flex items-center justify-center")}>
            <Loading size={24} />
          </div>
        ) : (
          <LineChart className="h-[150px]" data={data} />
        )}
      </div>
    </Wrap>
  );
}
