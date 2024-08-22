import { withCommonProps } from "next-common/lib";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isCentrifugeChain, isCollectivesChain } from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import CentrifugeOverviewSummary from "next-common/components/summary/centrifugeOverviewSummary";
import { useUser } from "next-common/context/user";
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
import useAccountUrl from "next-common/hooks/account/useAccountUrl";
import {
  fetchForumCategories,
  fetchForumLatestTopics,
} from "next-common/services/serverSide/forum";
import { BasicDataProvider } from "next-common/context/centrifuge/basicData";
import { DailyExtrinsicsProvider } from "next-common/context/centrifuge/DailyExtrinsics";
import { TokenPricesProvider } from "next-common/context/centrifuge/tokenPrices";
import useLoadOverviewPageData from "next-common/hooks/overview/useLoadOverviewPageData";
import Chains from "next-common/utils/consts/chains";
import isAssetHub from "next-common/utils/isAssetHub";
import AssetHubOverviewPage from "next-common/components/assets/assetHubOverviewPage";

function DefaultOverviewPage() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const user = useUser();
  const url = useAccountUrl();
  useLoadOverviewPageData();

  const tabs = [
    {
      label: "Overview",
      url: "/",
      exactMatch: false,
    },
  ];

  if (user?.address && chainSettings.showAccountManagementTab !== false) {
    tabs.push({
      label: "Account",
      url,
    });
  }

  if (chain === "interlay" || chain === "kintsugi") {
    tabs.push({
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
  if (isAssetHub()) {
    return <AssetHubOverviewPage />;
  }
  return <DefaultOverviewPage />;
}

export const getServerSideProps = withCommonProps(async () => {
  const chain = process.env.CHAIN;
  if (Chains.polkadotAssetHub === chain) {
    return {};
  }

  const tracksProps = await fetchOpenGovTracksProps();

  const overviewSummary = tracksProps.summary || {};
  const recentProposals = await fetchRecentProposalsProps(overviewSummary);

  const forumLatestTopics = await fetchForumLatestTopics();
  const forumCategories = await fetchForumCategories();

  return {
    props: {
      recentProposals,
      overviewSummary: overviewSummary,
      forumLatestTopics,
      forumCategories,
      ...tracksProps,
    },
  };
});
