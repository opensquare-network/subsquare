import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Pagination from "next-common/components/pagination";
import { defaultPageSize } from "next-common/utils/constants";
import WindowSizeProvider from "next-common/context/windowSize";
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

export default function CohortsHistory() {
  const { cohorts = [] } = usePageProps();

  return (
    <WindowSizeProvider>
      <NeutralPanel className="p-6">
        <CohortsHistoryImpl dataRows={cohorts} />
        <Pagination total={1} pageSize={defaultPageSize} current={1} />
      </NeutralPanel>
    </WindowSizeProvider>
  );
}
