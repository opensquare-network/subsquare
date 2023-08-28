import clsx from "clsx";
import Divider from "../styled/layout/divider";
import TabsList from "./tabsList";
import noop from "lodash.noop";
import { useEffect, useState } from "react";

export default function Tabs({
  tabs = [],
  activeTabLabel = "",
  onTabClick = noop,
}) {
  const [cached, setCached] = useState({});

  useEffect(() => {
    if (cached[activeTabLabel]) {
      return;
    }

    setCached((v) => ({
      ...v,
      [activeTabLabel]: true,
    }));
  }, [activeTabLabel]);

  return (
    <div>
      <TabsList
        tabs={tabs}
        activeTabLabel={activeTabLabel}
        onTabClick={onTabClick}
      />

      <Divider />

      <div className="mt-4">
        {tabs.map(
          (tab, idx) =>
            cached[tab.label] && (
              <div
                key={idx}
                className={clsx(
                  "hidden",
                  activeTabLabel === tab.label && "!block",
                )}
              >
                {tab.content}
              </div>
            ),
        )}
      </div>
    </div>
  );
}
