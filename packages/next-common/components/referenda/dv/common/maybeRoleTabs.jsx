import { useState, useMemo } from "react";
import Tabs from "next-common/components/tabs";
import useFormattedDelegates from "next-common/hooks/referenda/useFormattedDelegates";
import { isNil } from "lodash-es";
import { useDvDelegateGuardians } from "next-common/context/referenda/dv";
import { usePageProps } from "next-common/context/page";

export function RoleTabsImpl({
  component: Component,
  formattedDelegates = [],
}) {
  const { cohort } = usePageProps();
  const [activeTabValue, setActiveTabValue] = useState("delegate");

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
        labelExtra: (
          <span className="text-textTertiary text14Medium before:content-['·'] before:mx-1">
            {cohort?.delegateCnt}
          </span>
        ),
      },
      {
        value: "guardian",
        label: "Guardian",
        content: <Component delegates={filteredDelegates} />,
        labelExtra: (
          <span className="text-textTertiary text14Medium before:content-['·'] before:mx-1">
            {cohort?.guardianCnt}
          </span>
        ),
      },
    ];
  }, [activeTabValue, formattedDelegates, cohort]);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
    />
  );
}

export default function MaybeRoleTabs({ component: Component }) {
  const { hasGuardians } = useDvDelegateGuardians();
  const formattedDelegates = useFormattedDelegates();

  if (!hasGuardians) {
    return <Component delegates={formattedDelegates} />;
  }

  return (
    <RoleTabsImpl
      component={Component}
      formattedDelegates={formattedDelegates}
    />
  );
}
