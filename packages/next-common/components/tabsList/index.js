import noop from "lodash.noop";
import { cn } from "next-common/utils";

export default function TabsList({ tabs = [], onTabClick = noop, ...props }) {
  return (
    <ul
      {...props}
      className={cn(
        "flex space-x-6 overflow-x-auto scrollbar-hidden",
        props.className,
      )}
    >
      {tabs.map((tab, idx) => {
        return (
          <li
            key={idx}
            role="button"
            className="cursor-pointer"
            onClick={() => onTabClick(tab)}
          >
            {tab.render ? tab.render() : tab.label}
          </li>
        );
      })}
    </ul>
  );
}
