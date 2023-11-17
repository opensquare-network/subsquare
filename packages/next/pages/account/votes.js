import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MyVotes from "components/myvotes";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import {
  hasDefinedBounties,
  hasDefinedOffChainVoting,
} from "next-common/utils/summaryExternalInfo";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import Bounties from "next-common/components/summary/externalInfo/bounties";

export default function Votes({ overview }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.address) {
      router.push("/");
    }
  }, [user, router]);

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  let tabs = [
    {
      label: "Overview",
      url: "/",
    },
  ];

  if (user?.address) {
    tabs.push({
      label: "Account",
      url: "/account/votes",
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

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<ChainSocialLinks />}
      summary={<SummaryComponent summaryData={overview?.summary} />}
      summaryFooter={externalInfo}
      tabs={tabs}
    >
      <MyVotes />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const { result } = await nextApi.fetch("overview");
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      overview: result ?? null,
      ...tracksProps,
    },
  };
});
