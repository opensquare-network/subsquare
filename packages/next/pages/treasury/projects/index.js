import { withCommonProps } from "next-common/lib";
import { TreasuryProvider } from "next-common/context/treasury";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import TreasuryProjects from "next-common/components/treasury/projects";
import panelTabs from "next-common/components/treasury/status/panelTabs";
import { backendApi } from "next-common/services/nextApi";
import { useState } from "react";
import TreasuryProjectsTableView from "next-common/components/treasury/projects/table-view";
import ViewTypeTabs, {
  STATS_TAB_ID,
  TABLE_TAB_ID,
} from "next-common/components/treasury/projects/viewTypeTabs";
import ListTitleBar from "next-common/components/listTitleBar";
import { usePageProps } from "next-common/context/page";
import Tooltip from "next-common/components/tooltip";

const seoInfo = { title: "Treasury Projects", desc: "Treasury Projects" };

export default function TreasuryProjectsPage() {
  const { projects = [] } = usePageProps();
  const [selectedTabId, setSelectedTabId] = useState(STATS_TAB_ID);

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title="Treasury Projects"
        summary={<TreasuryStatusSummaryPanel />}
        tabs={panelTabs}
      >
        <div className="flex flex-col gap-y-6">
          <ListTitleBar
            title={
              <span className="inline-flex items-center gap-x-1">
                Projects
                <Tooltip content="The prices are calculated at awarded time."></Tooltip>
              </span>
            }
            titleCount={projects.length}
            titleExtra={
              <ViewTypeTabs
                selectedTabId={selectedTabId}
                setSelectedTabId={setSelectedTabId}
              />
            }
          />
          {selectedTabId === STATS_TAB_ID && <TreasuryProjects />}
          {selectedTabId === TABLE_TAB_ID && <TreasuryProjectsTableView />}
        </div>
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();
  const { result } = await backendApi.fetch("/treasury/status/projects");

  return {
    props: {
      projects: result ?? [],
      ...tracksProps,
    },
  };
});
