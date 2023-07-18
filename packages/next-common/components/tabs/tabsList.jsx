import clsx from "clsx";
import noop from "lodash.noop";

export default function TabsList({
  tabs = [],
  extra,
  activeTabLabel,
  onTabClick = noop,
}) {
  return (
    <div className="flex items-center justify-between">
      <ul className="flex space-x-6">
        {tabs.map((tab, idx) => {
          const itemClassName = clsx(
            "block pb-3",
            "text14Bold border-b-4 text-textPrimary",
            "hover:text-theme500",
          );
          const itemActiveClassName = "border-theme500 text-theme500";
          const active = tab.active ?? activeTabLabel === tab.label;

          return (
            <li key={idx}>
              <div
                role="button"
                className={clsx(
                  itemClassName,
                  active ? itemActiveClassName : "border-transparent",
                )}
                onClick={() => onTabClick(tab)}
              >
                {tab.label}
              </div>
            </li>
          );
        })}
      </ul>

      {extra}
    </div>
  );
}
