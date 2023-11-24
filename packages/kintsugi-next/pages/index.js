import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import { hasDefinedOffChainVoting } from "next-common/utils/summaryExternalInfo";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import { fetchActiveProposalsProps } from "next-common/services/serverSide/activeProposals";
import Overview from "next-common/components/overview/overview";

export default function Home() {
  const chain = useChain();
  const chainSettings = useChainSettings();

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  let externalInfo = null;
  if (hasDefinedOffChainVoting()) {
    externalInfo = (
      <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
        <OffChainVoting />
      </div>
    );
  }

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
      summary={<SummaryComponent />}
      summaryFooter={externalInfo}
    >
      <Overview />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const { result: summary } = await nextApi.fetch("summary");
  const { result: overviewSummary } = await nextApi.fetch("overview/summary");
  const activeProposals = await fetchActiveProposalsProps(overviewSummary);

  return {
    props: {
      summary: summary ?? {},
      activeProposals,
      overviewSummary: overviewSummary ?? {},
    },
  };
});
