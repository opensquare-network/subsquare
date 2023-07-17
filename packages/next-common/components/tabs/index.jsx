import clsx from "clsx";
import Divider from "../styled/layout/divider";
import TabsList from "./tabsList";
import noop from "lodash.noop";

export default function Tabs({
  tabs = [],
  tabsListExtra,
  activeTab = "",
  onTabClick = noop,
}) {
  return (
    <div>
      <TabsList
        tabs={tabs}
        extra={tabsListExtra}
        activeTab={activeTab}
        onTabClick={onTabClick}
      />

      <Divider />

      <div className="mt-4">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={clsx("hidden", activeTab === tab.label && "!block")}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
