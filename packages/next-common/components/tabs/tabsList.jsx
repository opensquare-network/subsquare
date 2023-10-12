import { cn } from "next-common/utils";
import noop from "lodash.noop";

export default function TabsList({
  tabs = [],
  activeTabLabel,
  onTabClick = noop,
}) {
  return (
    <ul className="flex space-x-6 overflow-x-auto scrollbar-hidden">
      {tabs.map((tab, idx) => {
        const itemClassName = cn(
          "block whitespace-nowrap pb-3",
          "text14Bold border-b-4 text-textPrimary",
          "hover:text-theme500",
        );
        const itemActiveClassName = "border-theme500 text-theme500";
        const active = tab.active ?? activeTabLabel === tab.label;

        return (
          <li
            key={idx}
            role="button"
            className={cn(
              itemClassName,
              active ? itemActiveClassName : "border-transparent",
            )}
            onClick={() => onTabClick(tab)}
          >
            {tab.label}
            {!!tab.activeCount && (
              <span className="ml-1 text-textTertiary text14Medium">
                {tab.activeCount}
              </span>
            )}
            {tab.labelExtra}
          </li>
        );
      })}
    </ul>
  );
}
