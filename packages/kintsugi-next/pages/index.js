import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import { hasDefinedOffChainVoting } from "next-common/utils/summaryExternalInfo";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import { fetchRecentProposalsProps } from "next-common/services/serverSide/recentProposals";
import Overview from "next-common/components/overview/overview";

export default function Home() {
  const { name, description } = useChainSettings();

  let externalInfo = null;
  if (hasDefinedOffChainVoting()) {
    externalInfo = (
      <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
        <OffChainVoting />
      </div>
    );
  }

  const tabs = [
    {
      label: "Overview",
      url: "/",
      exactMatch: false,
    },
    {
      label: "Escrow",
      url: "/escrow",
    },
  ];

  return (
    <ListLayout
      title={name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={description}
      headContent={<HeadContent />}
      summary={<OverviewSummary />}
      summaryFooter={externalInfo}
      tabs={tabs}
    >
      <Overview />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const { result: overviewSummary } = await nextApi.fetch("overview/summary");
  const { result: recentSummary = {} } = await nextApi.fetch(
    "overview/recent/summary",
  );
  const recentProposals = await fetchRecentProposalsProps(overviewSummary);

  return {
    props: {
      summary: overviewSummary ?? {},
      overviewSummary: overviewSummary ?? {},
      recentSummary: recentSummary ?? {},
      recentProposals,
    },
  };
});
