import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import LoadableItem from "next-common/components/overview/accountInfo/components/loadableItem";

export default function CommonRewardPanel({
  value,
  isLoading = false,
  title = "Unclaimed Rewards",
  children,
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex",
        isMobile ? "flex-col" : "items-center justify-end gap-8",
      )}
    >
      <div className={cn("flex", isMobile && "w-full inline-flex flex-col")}>
        <LoadableItem
          value={value}
          isLoading={isLoading}
          title={title}
          className="inline-flex flex-row items-center justify-between"
          titleClassName="mb-0 text14Medium text-textTertiary flex-1"
          valueClassName="text14Medium min-w-[60px] ml-2 inline-flex justify-end"
        />
      </div>
      <div
        className={cn(
          "flex gap-4 justify-end",
          isMobile ? "w-full" : "w-[120px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
