import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { useChain, useChainSettings } from "next-common/context/chain";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import { isCollectivesChain } from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MyVotes from "components/myvotes";

export default withLoginUserRedux(({ overview }) => {
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
      label: "My Votes",
      url: "/votes",
    });
  }

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<ChainSocialLinks />}
      summary={<SummaryComponent summaryData={overview?.summary} />}
      tabs={tabs}
    >
      <MyVotes />
    </ListLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  const { result } = await nextApi.fetch("overview");

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      overview: result ?? null,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
