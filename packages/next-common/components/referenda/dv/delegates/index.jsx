import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import WindowSizeProvider from "next-common/context/windowSize";
import DelegatesDesktopList from "./desktopList";
import DelegatesMobileList from "./mobileList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import MaybeDelegatesRoleTabs from "../common/maybeRoleTabs";

function DelegatesImpl({ delegates = [] }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DelegatesMobileList delegates={delegates} />;
  }

  return <DelegatesDesktopList delegates={delegates} />;
}

export default function Delegates() {
  return (
    <WindowSizeProvider>
      <SecondaryCard>
        <MaybeDelegatesRoleTabs component={DelegatesImpl} />
      </SecondaryCard>
    </WindowSizeProvider>
  );
}
