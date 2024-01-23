import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import { hasDefinedOffChainVoting } from "next-common/utils/summaryExternalInfo";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import { fetchRecentProposalsProps } from "next-common/services/serverSide/recentProposals";
import Overview from "next-common/components/overview/overview";
import { useUser } from "next-common/context/user";
import useAccountUrl from "next-common/hooks/account/useAccountUrl";

export default function Home() {
  const { name, description } = useChainSettings();
  const user = useUser();
  const url = useAccountUrl();

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
  ];

  if (user?.address) {
    tabs.push({
      label: "Account",
      url,
    });
  }

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
  const { result: summary } = await nextApi.fetch("summary");
  const { result: overviewSummary } = await nextApi.fetch("overview/summary");
  const recentProposals = await fetchRecentProposalsProps(overviewSummary);

  return {
    props: {
      summary: summary ?? {},
      recentProposals,
      overviewSummary: overviewSummary ?? {},
    },
  };
});
