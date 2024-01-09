import { useNavCollapsed } from "next-common/context/nav";
import { SummaryTitle } from "./styled";
import { cn } from "next-common/utils";

export default function SummaryItems({ items, className }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "w-full grid grid-cols-4 gap-4",
        navCollapsed ? "max-sm:grid-cols-2" : "max-md:grid-cols-2",
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex-1 flex justify-between">
          <div>
            {item.title && <SummaryTitle>{item.title}</SummaryTitle>}
            <div
              className={cn(
                "text16Bold text-textPrimary",
                "space-x-1",
                "[&_.unit]:text-textTertiary",
                "[&_.total]:text-textTertiary [&_.total]:text-[12px]",
                "[&_.upper]:uppercase",
              )}
            >
              {item.content}
            </div>
          </div>
          {item.suffix && <div>{item.suffix}</div>}
        </div>
      ))}
    </div>
  );
}
