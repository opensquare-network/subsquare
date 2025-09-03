import { useState, useMemo } from "react";
import Tabs from "next-common/components/tabs";
import useFormattedDelegates from "next-common/hooks/referenda/useFormattedDelegates";
import { isNil } from "lodash-es";

export default function RoleTabs({ component: Component }) {
  const [activeTabValue, setActiveTabValue] = useState("delegate");
  const formattedDelegates = useFormattedDelegates();

  const tabs = useMemo(() => {
    if (isNil(formattedDelegates)) {
      return [];
    }

    const filteredDelegates = formattedDelegates.filter(
      (delegate) => delegate.role === activeTabValue,
    );

    return [
      {
        value: "delegate",
        label: "DAO",
        content: <Component delegates={filteredDelegates} />,
      },
      {
        value: "guardian",
        label: "Guardian",
        content: <Component delegates={filteredDelegates} />,
      },
    ];
  }, [activeTabValue, formattedDelegates]);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
    />
  );
}
