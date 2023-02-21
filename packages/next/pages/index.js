import Overview from "next-common/components/overview";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  toCouncilMotionListItem,
  toDiscussionListItem,
  toExternalProposalListItem,
  toFinancialMotionsListItem,
  toPublicProposalListItem,
  toReferendaListItem,
  toTechCommMotionListItem,
  toTipListItem,
  toTreasuryBountyListItem,
  toTreasuryProposalListItem,
} from "utils/viewfuncs";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { useChain } from "next-common/context/chain";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import Chains from "next-common/utils/consts/chains";
import normalizeFellowshipReferendaListItem from "next-common/utils/gov2/list/normalizeFellowshipReferendaListItem";
import normalizeReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";

export default withLoginUserRedux(({ overview, tracks, fellowshipTracks }) => {
  const chain = useChain();
  const isKarura = ["karura", "acala"].includes(chain);
  const hasGov2 = ["kusama", "development"].includes(chain);
  const isCentrifuge = [Chains.centrifuge, Chains.altair].includes(chain);

  const discussionsCategory = [
    {
      category: "Discussions",
      link: "/discussions",
      items: (overview?.discussions ?? []).map((item) =>
        toDiscussionListItem(chain, item)
      ),
    },
  ];

  const discussions = isCentrifuge ? [] : discussionsCategory;

  let overviewData = [];

  if (hasGov2) {
    overviewData.push(
      ...[
        {
          category: "OpenGov Referenda",
          link: "/referenda",
          items: (overview?.gov2?.referenda ?? []).map((item) =>
            normalizeReferendaListItem(item, tracks)
          ),
        },
        {
          category: "Fellowship",
          link: "/fellowship",
          items: (overview?.gov2?.fellowshipReferenda ?? []).map((item) =>
            normalizeFellowshipReferendaListItem(item, fellowshipTracks)
          ),
        },
      ]
    );
  }

  overviewData.push(
    ...[
      {
        category: "Referenda",
        link: "/democracy/referenda",
        items: (overview?.democracy?.referenda ?? []).map((item) =>
          toReferendaListItem(chain, item)
        ),
      },
      {
        category: "Democracy External Proposals",
        link: "/democracy/externals",
        items: (overview?.democracy?.externals ?? []).map((item) =>
          toExternalProposalListItem(chain, item)
        ),
      },
      {
        category: "Democracy Public Proposals",
        link: "/democracy/proposals",
        items: (overview?.democracy?.proposals ?? []).map((item) =>
          toPublicProposalListItem(chain, item)
        ),
      },
      ...discussions,
      {
        category: "Council Motions",
        link: "/council/motions",
        items: (overview?.council?.motions ?? []).map((item) =>
          toCouncilMotionListItem(chain, item)
        ),
      },
      {
        category: "Tech. Comm. Proposals",
        link: "/techcomm/proposals",
        items: (overview?.techComm?.motions ?? []).map((item) =>
          toTechCommMotionListItem(chain, item)
        ),
      },
    ]
  );

  if (isKarura) {
    overviewData.push({
      category: "Financial Council Motions",
      link: "/financial-council/motions",
      items: (overview?.financialCouncil?.motions ?? []).map((item) =>
        toFinancialMotionsListItem(chain, item)
      ),
    });
  }

  overviewData.push(
    ...[
      {
        category: "Treasury Proposals",
        link: "/treasury/proposals",
        items: (overview?.treasury?.proposals ?? []).map((item) =>
          toTreasuryProposalListItem(chain, item)
        ),
      },
      {
        category: "Treasury Bounties",
        link: "/treasury/bounties",
        items: (overview?.treasury?.bounties ?? []).map((item) =>
          toTreasuryBountyListItem(chain, item)
        ),
      },
      {
        category: "Tips",
        link: "/treasury/tips",
        items: (overview?.treasury?.tips ?? []).map((item) =>
          toTipListItem(chain, item)
        ),
      },
    ]
  );

  if (chain === "kabocha") {
    overviewData = discussionsCategory;
  }

  const filteredOverviewData = overviewData.filter(
    (data) => data?.items?.length > 0 || data?.category === "Discussions"
  );

  // Sort the items with length = 0 to the end of the list
  filteredOverviewData.sort((a, b) =>
    a?.items?.length > 0 && b?.items?.length > 0
      ? 0
      : b?.items?.length - a?.items?.length
  );

  return (
    <HomeLayout>
      <Overview
        overviewData={filteredOverviewData}
        summaryData={overview?.summary}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  const { result } = await nextApi.fetch(`overview`);

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
