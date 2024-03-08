import { noop } from "lodash-es";
import { cn } from "next-common/utils";
import { forwardRef } from "react";

export default forwardRef(function TabsList(
  { tabs = [], onTabClick = noop, ...props },
  ref,
) {
  return (
    <ul
      ref={ref}
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
});
