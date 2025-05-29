import { withCommonProps } from "next-common/lib";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  isAssetHubChain,
  isCentrifugeChain,
  isCollectivesChain,
} from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import CentrifugeOverviewSummary from "next-common/components/summary/centrifugeOverviewSummary";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import Bounties from "next-common/components/summary/externalInfo/bounties";
import {
  hasDefinedBounties,
  hasDefinedOffChainVoting,
} from "next-common/utils/summaryExternalInfo";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchRecentProposalsProps } from "next-common/services/serverSide/recentProposals";
import Overview from "next-common/components/overview/overview";
import CentrifugeOverview from "next-common/components/overview/centrifugeOverview";
import {
  fetchForumCategories,
  fetchForumLatestTopics,
} from "next-common/services/serverSide/forum";
import { BasicDataProvider } from "next-common/context/centrifuge/basicData";
import { DailyExtrinsicsProvider } from "next-common/context/centrifuge/DailyExtrinsics";
import { TokenPricesProvider } from "next-common/context/centrifuge/tokenPrices";
import { backendApi } from "next-common/services/nextApi";

function DefaultOverviewPage() {
  const chain = useChain();
  const chainSettings = useChainSettings();

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      url: "/",
      exactMatch: false,
    },
  ];

  if (chain === "interlay" || chain === "kintsugi") {
    tabs.push({
      value: "escrow",
      label: "Escrow",
      url: "/escrow",
    });
  }

  let externalInfo = null;
  if (hasDefinedOffChainVoting() || hasDefinedBounties()) {
    externalInfo = (
      <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
        <OffChainVoting />
        <Bounties />
      </div>
    );
  }

  if (isCentrifugeChain(chain)) {
    return (
      <BasicDataProvider>
        <DailyExtrinsicsProvider>
          <TokenPricesProvider>
            <ListLayout
              title={chainSettings.name}
              titleExtra={<TitleExtra />}
              seoInfo={{ title: "" }}
              description={chainSettings.description}
              headContent={<HeadContent />}
              summary={<CentrifugeOverviewSummary />}
              summaryFooter={externalInfo}
              tabs={tabs}
            >
              <CentrifugeOverview />
            </ListLayout>
          </TokenPricesProvider>
        </DailyExtrinsicsProvider>
      </BasicDataProvider>
    );
  }

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
      summary={
        isCollectivesChain(chain) ? (
          <AllianceOverviewSummary />
        ) : (
          <OverviewSummary />
        )
      }
      summaryFooter={externalInfo}
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
