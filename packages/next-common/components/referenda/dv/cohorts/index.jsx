import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { usePageProps } from "next-common/context/page";
import CohortsHistoryDesktopList from "./desktopList";
import CohortsHistoryMobileList from "./mobileList";

export function CohortsHistoryImpl({ dataRows = [] }) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <CohortsHistoryMobileList />;
  }

  return <CohortsHistoryDesktopList dataRows={dataRows} />;
}

export default function Cohorts() {
  const { cohorts = [] } = usePageProps();

  return (
    <NeutralPanel className="p-6">
      <CohortsHistoryImpl dataRows={cohorts} />
    </NeutralPanel>
  );
}
