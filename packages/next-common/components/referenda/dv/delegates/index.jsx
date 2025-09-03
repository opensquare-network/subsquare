import { isNil } from "lodash-es";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import WindowSizeProvider from "next-common/context/windowSize";
import { usePageProps } from "next-common/context/page";
import Tabs from "next-common/components/tabs";
import DelegatesDesktopList from "./desktopList";
import DelegatesMobileList from "./mobileList";
import { useMemo, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useFormattedDelegates from "next-common/hooks/referenda/useFormattedDelegates";

function DelegatesImpl({ delegates = [] }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DelegatesMobileList delegates={delegates} />;
  }

  return <DelegatesDesktopList delegates={delegates} />;
}

function DelegatesRole() {
  const { cohort } = usePageProps();
  const [activeTabValue, setActiveTabValue] = useState("delegate");
  const formattedDelegates = useFormattedDelegates();

  const tabs = useMemo(() => {
    const filteredDelegates = formattedDelegates.filter(
      (delegate) => delegate.role === activeTabValue,
    );
    return [
      {
        value: "delegate",
        label: "DAO",
        content: <DelegatesImpl delegates={filteredDelegates} />,
      },
      {
        value: "guardian",
        label: "Guardian",
        content: <DelegatesImpl delegates={filteredDelegates} />,
      },
    ];
  }, [activeTabValue, formattedDelegates]);

  if (isNil(cohort)) return null;

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
    />
  );
}

export default function Delegates() {
  return (
    <WindowSizeProvider>
      <SecondaryCard>
        <DelegatesRole />
      </SecondaryCard>
    </WindowSizeProvider>
  );
}
