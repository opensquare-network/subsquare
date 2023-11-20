import { withCommonProps } from "next-common/lib";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import { useUser } from "next-common/context/user";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import Bounties from "next-common/components/summary/externalInfo/bounties";
import {
  hasDefinedBounties,
  hasDefinedOffChainVoting,
} from "next-common/utils/summaryExternalInfo";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import useFetchMyDemocracyDeposits from "next-common/hooks/account/deposit/useFetchMyDemocracyDeposits";
import useFetchMyTreasuryDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits";
import useFetchMyReferendaDeposits from "next-common/hooks/account/deposit/referenda";
import useFetchMyFellowshipDeposits from "next-common/hooks/account/deposit/useFetchMyFellowshipDeposits";
import useFetchMyPreimageDeposits from "next-common/hooks/account/deposit/useFetchMyPreimageDeposits";
import { fetchActiveProposalsProps } from "next-common/services/serverSide/activeProposals";
import Overview from "next-common/components/overview/overview";

export default function HomePage() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const user = useUser();

  useFetchMyDemocracyDeposits();
  useFetchMyTreasuryDeposits();
  useFetchMyReferendaDeposits();
  useFetchMyFellowshipDeposits();
  useFetchMyPreimageDeposits();

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  const tabs = [
    {
      label: "Overview",
      url: "/",
      exactMatch: false,
    },
  ];

  if (chainSettings.hasReferenda || !chainSettings.noDemocracyModule) {
    if (user?.address) {
      tabs.push({
        label: "Account",
        url: "/account/votes",
      });
    }
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

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
      summary={<SummaryComponent />}
      summaryFooter={externalInfo}
      tabs={tabs}
    >
      <Overview />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();
  const activeProposals = await fetchActiveProposalsProps(tracksProps.summary);

  return {
    props: {
      activeProposals,
      summary: tracksProps.summary,
      ...tracksProps,
    },
  };
});
