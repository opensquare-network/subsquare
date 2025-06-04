import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import { isAssetHubChain } from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchRecentProposalsProps } from "next-common/services/serverSide/recentProposals";
import Overview from "next-common/components/overview/overview";
import {
  fetchForumCategories,
  fetchForumLatestTopics,
} from "next-common/services/serverSide/forum";
import { backendApi } from "next-common/services/nextApi";

function DefaultOverviewPage() {
  const chainSettings = useChainSettings();

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      url: "/",
      exactMatch: false,
    },
  ];

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
      summary={<AllianceOverviewSummary />}
      tabs={tabs}
    >
      <Overview />
    </ListLayout>
  );
}

export default function HomePage() {
  return <DefaultOverviewPage />;
}

export const getServerSideProps = withCommonProps(async () => {
  const chain = process.env.CHAIN;
  if (isAssetHubChain(chain)) {
    return {};
  }

  const tracksProps = await fetchOpenGovTracksProps();

  const overviewSummary = tracksProps.summary || {};
  const { result: recentSummary = {} } = await backendApi.fetch(
    "overview/recent/summary",
  );
  const recentProposals = await fetchRecentProposalsProps(recentSummary);

  const forumLatestTopics = await fetchForumLatestTopics();
  const forumCategories = await fetchForumCategories();

  return {
    props: {
      recentProposals,
      overviewSummary,
      recentSummary,
      forumLatestTopics,
      forumCategories,
      ...tracksProps,
    },
  };
});
