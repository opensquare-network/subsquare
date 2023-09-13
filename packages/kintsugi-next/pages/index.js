import OverviewPostList from "next-common/components/overview/postList";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toDiscussionListItem } from "utils/viewfuncs";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { useChainSettings } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import { hasDefinedOffChainVoting } from "next-common/utils/summaryExternalInfo";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import { HeadContent, TitleExtra } from "next-common/components/overview";

export default function Home({ overview, chain }) {
  const chainSettings = useChainSettings();

  let overviewData = [
    {
      category: "Discussions",
      link: "/discussions",
      items: (overview?.discussions ?? []).map((item) =>
        toDiscussionListItem(chain, item),
      ),
    },
    {
      category: "Referenda",
      link: "/democracy/referenda",
      items: (overview?.democracy?.referenda ?? []).map((item) =>
        normalizeReferendaListItem(chain, item),
      ),
    },
    {
      category: "Democracy Public Proposals",
      link: "/democracy/proposals",
      items: (overview?.democracy?.proposals ?? []).map((item) =>
        normalizeProposalListItem(chain, item),
      ),
    },
    {
      category: "Treasury Proposals",
      link: "/treasury/proposals",
      items: (overview?.treasury?.proposals ?? []).map((item) =>
        normalizeTreasuryProposalListItem(chain, item),
      ),
    },
    {
      category: "Tech. Comm. Proposals",
      link: "/techcomm/proposals",
      items: (overview?.techComm?.motions ?? []).map((item) =>
        normalizeTechCommMotionListItem(chain, item),
      ),
    },
  ];

  const filteredOverviewData = overviewData.filter(
    (data) => data?.items?.length > 0 || data?.category === "Discussions",
  );

  // Sort the items with length = 0 to the end of the list
  filteredOverviewData.sort((a, b) =>
    a?.items?.length > 0 && b?.items?.length > 0
      ? 0
      : b?.items?.length - a?.items?.length,
  );

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
      summary={<SummaryComponent summaryData={overview?.summary} />}
      summaryFooter={externalInfo}
    >
      <OverviewPostList overviewData={filteredOverviewData} />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const chain = process.env.CHAIN;
  const { result } = await nextApi.fetch("overview");

  return {
    props: {
      chain,
      overview: result ?? null,
    },
  };
});
