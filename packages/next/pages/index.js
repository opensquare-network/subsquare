import Overview from "next-common/components/overview";
import OverviewV2 from "next-common/components/overview/v2";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  toFinancialMotionsListItem,
  toAdvisoryMotionsListItem,
} from "utils/viewfuncs";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { useChain } from "next-common/context/chain";
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

export default withLoginUserRedux(({ overview, tracks, fellowshipTracks }) => {
  const chain = useChain();
  const isKarura = ["karura", "acala"].includes(chain);
  const hasGov2 = ["kusama", "development"].includes(chain);
  const isCentrifuge = [Chains.centrifuge, Chains.altair].includes(chain);
  const isCollectives = isCollectivesChain(chain);
  const isZeitgeist = chain === Chains.zeitgeist;

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

  if (hasGov2) {
    overviewData.push(
      {
        category: businessCategory.openGovReferenda,
        link: "/referenda",
        items: (overview?.gov2?.referenda ?? []).map((item) =>
          normalizeGov2ReferendaListItem(item, tracks),
        ),
      },
      {
        category: businessCategory.fellowship,
        link: "/fellowship",
        items: (overview?.gov2?.fellowshipReferenda ?? []).map((item) =>
          normalizeFellowshipReferendaListItem(item, fellowshipTracks),
        ),
      },
    );
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
    {
      category: businessCategory.councilMotions,
      link: "/council/motions",
      items: (overview?.council?.motions ?? []).map((item) =>
        normalizeCouncilMotionListItem(chain, item),
      ),
    },
    {
      category: businessCategory.tcProposals,
      link: "/techcomm/proposals",
      items: (overview?.techComm?.motions ?? []).map((item) =>
        normalizeTechCommMotionListItem(chain, item),
      ),
    },
  );

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

  return (
    <ListLayout>
      <OverviewV2
        overviewData={filteredOverviewData}
        summaryData={overview?.summary}
      />
    </ListLayout>
  );

  return (
    <HomeLayout tracks={tracks} fellowshipTracks={fellowshipTracks}>
      <Overview
        overviewData={filteredOverviewData}
        summaryData={overview?.summary}
      />
    </HomeLayout>
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
