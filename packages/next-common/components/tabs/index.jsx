import clsx from "clsx";
import Divider from "../styled/layout/divider";
import TabsList from "./tabsList";
import noop from "lodash.noop";

export default function Tabs({
  tabs = [],
  tabsListExtra,
  activeTabLabel = "",
  onTabClick = noop,
}) {
  return (
    <div>
      <TabsList
        tabs={tabs}
        extra={tabsListExtra}
        activeTabLabel={activeTabLabel}
        onTabClick={onTabClick}
      />

      <Divider />

      <div className="mt-4">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={clsx("hidden", activeTabLabel === tab.label && "!block")}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
