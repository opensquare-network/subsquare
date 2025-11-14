import { withCommonProps } from "next-common/lib";
import { TreasuryProvider } from "next-common/context/treasury";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasuryStatusSummaryPanel from "next-common/components/treasury/status/summaryPanel";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import TreasuryProjects from "next-common/components/treasury/projects";
import panelTabs from "next-common/components/treasury/status/panelTabs";

const seoInfo = { title: "Treasury Projects", desc: "Treasury Projects" };

export default function TreasuryProjectsPage() {
  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title="Treasury Projects"
        summary={<TreasuryStatusSummaryPanel />}
        tabs={panelTabs}
      >
        <div className="flex flex-col gap-y-4">
          <TreasuryProjects />
        </div>
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
