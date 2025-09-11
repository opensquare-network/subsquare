import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";

export default function PostListMyVoteMarkTemplate({
  items,
  isAye,
  isNay,
  isSplit,
  isSplitAbstain,
}) {
  return (
    <Tooltip
      className="p-1"
      content={
        items?.length && (
          <div>
            {items?.map((item) => (
              <div key={item.label}>
                {item.label}: {item.value}
              </div>
            ))}
          </div>
        )
      }
    >
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isAye && "bg-green500",
          isNay && "bg-red500",
          (isSplit || isSplitAbstain) && "bg-neutral500",
        )}
      />
    </Tooltip>
  );
}
