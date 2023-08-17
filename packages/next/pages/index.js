import OverviewPostList from "next-common/components/overview/postList";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  toAdvisoryMotionsListItem,
  toFinancialMotionsListItem,
} from "utils/viewfuncs";
import { useChain, useChainSettings } from "next-common/context/chain";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import Chains from "next-common/utils/consts/chains";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import normalizeTechCommMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTechCommMotionListItem";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import normalizeExternalListItem from "next-common/utils/viewfuncs/democracy/normliazeExternalListItem";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import normalizeCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeCouncilMotionListItem";
import normalizeDiscussionListItem from "next-common/utils/viewfuncs/discussion/normalizeDiscussionListItem";
import normalizeReferendaListItem from "next-common/utils/viewfuncs/democracy/normalizeReferendaListItem";
import normalizeAllianceMotion from "next-common/utils/viewfuncs/alliance/allianceMotion";
import normalizeAllianceAnnouncement from "next-common/utils/viewfuncs/alliance/allianceAnnouncement";
import { isCollectivesChain } from "next-common/utils/chain";
import businessCategory from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import isMoonChain from "next-common/utils/isMoonChain";
import normalizeTreasuryCouncilMotionListItem from "next-common/utils/viewfuncs/collective/normalizeTreasuryCouncilMotionListItem";
import normalizeOpenTechCommProposalListItem from "next-common/utils/viewfuncs/collective/normalizeOpenTechCommProposalListItem";
import { useUser } from "next-common/context/user";
import Link from "next/link";
import { SystemTip } from "@osn/icons/subsquare";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import Bounties from "next-common/components/summary/externalInfo/bounties";
import Api from "next-common/services/api";
import {
  hasDefinedOffChainVoting,
  hasDefinedBounties,
} from "next-common/utils/summaryExternalInfo";

function SubscribeTip() {
  return (
    <Link
      className="flex gap-1 items-center p-[6px] bg-neutral200 rounded-[16px] overflow-hidden"
      href="/setting/notification"
    >
      <div className="inline-flex">
        <SystemTip
          className="[&_path]:fill-textTertiary"
          width={20}
          height={20}
        />
      </div>
      <span className="text-[14px] leading-[20px] whitespace-nowrap text-textSecondary">
        <span className="text-theme500 font-medium">Subscribe</span> on-chain
        events
      </span>
    </Link>
  );
}

export default withLoginUserRedux(
  ({ overview, tracks, fellowshipTracks, activeBountyPosts }) => {
    const chain = useChain();
    const isKarura = ["karura", "acala"].includes(chain);
    const isCentrifuge = [Chains.centrifuge, Chains.altair].includes(chain);
    const isCollectives = isCollectivesChain(chain);
    const isZeitgeist = chain === Chains.zeitgeist;
    const chainSettings = useChainSettings();
    const user = useUser();

    const discussionsCategory = [
      {
        category: businessCategory.discussions,
        link: "/discussions",
        items: (overview?.discussions ?? []).map((item) =>
          normalizeDiscussionListItem(chain, item),
        ),
      },
    ];

    const discussions = isCentrifuge ? [] : discussionsCategory;

    let overviewData = [];

    if (chainSettings.hasReferenda) {
      overviewData.push({
        category: businessCategory.openGovReferenda,
        link: "/referenda",
        items: (overview?.gov2?.referenda ?? []).map((item) =>
          normalizeGov2ReferendaListItem(item, tracks),
        ),
      });
    }
    if (chainSettings.hasFellowship) {
      overviewData.push({
        category: businessCategory.fellowship,
        link: "/fellowship",
        items: (overview?.gov2?.fellowshipReferenda ?? []).map((item) =>
          normalizeFellowshipReferendaListItem(item, fellowshipTracks),
        ),
      });
    }

    if (isCollectives) {
      overviewData.push(
        {
          category: businessCategory.allianceMotions,
          link: "/alliance/motions",
          items: (overview?.alliance?.motions ?? []).map((item) =>
            normalizeAllianceMotion(item),
          ),
        },
        {
          category: businessCategory.allianceAnnouncements,
          link: "/alliance/announcements",
          items: (overview?.alliance?.announcements ?? []).map((item) =>
            normalizeAllianceAnnouncement(item),
          ),
        },
      );
    }

    overviewData.push(
      {
        category: businessCategory.democracyReferenda,
        link: "/democracy/referenda",
        items: (overview?.democracy?.referenda ?? []).map((item) =>
          normalizeReferendaListItem(chain, item),
        ),
      },
      {
        category: businessCategory.democracyExternals,
        link: "/democracy/externals",
        items: (overview?.democracy?.externals ?? []).map((item) =>
          normalizeExternalListItem(chain, item),
        ),
      },
      {
        category: businessCategory.democracyProposals,
        link: "/democracy/proposals",
        items: (overview?.democracy?.proposals ?? []).map((item) =>
          normalizeProposalListItem(chain, item),
        ),
      },
      ...discussions,
    );

    if (isMoonChain()) {
      overviewData.push(
        {
          category: businessCategory.councilMotions,
          link: "/council/motions",
          items: (overview?.moonCouncil?.motions ?? []).map((item) =>
            normalizeCouncilMotionListItem(chain, item),
          ),
        },
        {
          category: businessCategory.treasuryCouncilMotions,
          link: "/treasury-council/motions",
          items: (overview?.council?.motions ?? []).map((item) =>
            normalizeTreasuryCouncilMotionListItem(chain, item),
          ),
        },
      );
    } else {
      overviewData.push({
        category: businessCategory.councilMotions,
        link: "/council/motions",
        items: (overview?.council?.motions ?? []).map((item) =>
          normalizeCouncilMotionListItem(chain, item),
        ),
      });
    }

    overviewData.push({
      category: businessCategory.tcProposals,
      link: "/techcomm/proposals",
      items: (overview?.techComm?.motions ?? []).map((item) =>
        normalizeTechCommMotionListItem(chain, item),
      ),
    });
    if (isMoonChain()) {
      overviewData.push({
        category: businessCategory.openTechCommitteeProposals,
        link: "/open-techcomm/proposals",
        items: (overview?.openTechComm?.motions ?? []).map((item) =>
          normalizeOpenTechCommProposalListItem(chain, item),
        ),
      });
    }

    if (isKarura) {
      overviewData.push({
        category: businessCategory.financialMotions,
        link: "/financial-council/motions",
        items: (overview?.financialCouncil?.motions ?? []).map((item) =>
          toFinancialMotionsListItem(chain, item),
        ),
      });
    }

    overviewData.push(
      {
        category: businessCategory.treasuryProposals,
        link: "/treasury/proposals",
        items: (overview?.treasury?.proposals ?? []).map((item) =>
          normalizeTreasuryProposalListItem(chain, item),
        ),
      },
      {
        category: businessCategory.treasuryBounties,
        link: "/treasury/bounties",
        items: (overview?.treasury?.bounties ?? []).map((item) =>
          normalizeBountyListItem(chain, item),
        ),
      },
      {
        category: businessCategory.treasuryTips,
        link: "/treasury/tips",
        items: (overview?.treasury?.tips ?? []).map((item) =>
          normalizeTipListItem(chain, item),
        ),
      },
    );

    if (isZeitgeist) {
      overviewData.push({
        category: businessCategory.advisoryMotions,
        link: "/advisory-committee/motions",
        items: (overview?.advisoryCommittee?.motions ?? []).map((item) =>
          toAdvisoryMotionsListItem(chain, item),
        ),
      });
    }

    if (chain === "kabocha") {
      overviewData = discussionsCategory;
    }

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
          label: "My Votes",
          url: "/votes",
        });
      }
    }
    const titleExtra = (
      <div className="max-md:hidden transition-all h-[32px] w-[32px] hover:w-[224px] [&_span]:hidden [&_span]:hover:inline">
        <SubscribeTip />
      </div>
    );

    const headContent = (
      <div className="flex flex-col gap-[16px]">
        <ChainSocialLinks />
        <div className="md:hidden">
          <SubscribeTip />
        </div>
      </div>
    );

    let externalInfo = null;
    if (hasDefinedOffChainVoting() || activeBountyPosts.length > 0) {
      externalInfo = (
        <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
          {hasDefinedOffChainVoting() && <OffChainVoting />}
          {hasDefinedBounties() && <Bounties />}
        </div>
      );
    }

    return (
      <ListLayout
        title={chainSettings.name}
        titleExtra={titleExtra}
        seoInfo={{ title: "" }}
        description={chainSettings.description}
        headContent={headContent}
        summary={<SummaryComponent summaryData={overview?.summary} />}
        summaryFooter={externalInfo}
        tabs={tabs}
      >
        <OverviewPostList overviewData={filteredOverviewData} />
      </ListLayout>
    );
  },
);

export const getServerSideProps = withLoginUser(async () => {
  const { result } = await nextApi.fetch("overview");

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  let activeOffChainVotingPosts = null;
  if (hasDefinedOffChainVoting()) {
    const offChainVotingApi = new Api(
      process.env.NEXT_PUBLIC_OFF_CHAIN_VOTING_SITE_URL ||
        "https://voting.opensquare.io",
    );
    ({ result: activeOffChainVotingPosts } = await offChainVotingApi.fetch(
      `/api/${process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE}/proposals/active`,
    ));
  }

  let activeBountyPosts = null;
  if (hasDefinedBounties()) {
    const bountiesApi = new Api(process.env.NEXT_PUBLIC_BOUNTIES_API_URL);
    ({ result: activeBountyPosts } = await bountiesApi.fetch("child-bounties"));
  }

  return {
    props: {
      overview: result ?? null,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
      activeOffChainVotingPosts: activeOffChainVotingPosts?.items ?? [],
      activeBountyPosts:
        activeBountyPosts?.items?.filter(
          (item) => item.network === process.env.CHAIN,
        ) ?? [],
    },
  };
});
