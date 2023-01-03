import Overview from "next-common/components/overview";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import {
  toCouncilMotionListItem,
  toDiscussionListItem,
  toExternalProposalListItem,
  toFellowshipReferendaListItem,
  toFinancialMotionsListItem,
  toGov2ReferendaListItem,
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

export default withLoginUserRedux(({ overview, tracks, fellowshipTracks }) => {
  const chain = useChain();
  const isKarura = ["karura", "acala"].includes(chain);
  const hasGov2 = ["kusama", "development"].includes(chain);

  let overviewData = [];

  if (hasGov2) {
    overviewData.push(
      ...[
        {
          category: "OpenGov Referenda",
          items: (overview?.gov2?.referenda ?? []).map((item) =>
            toGov2ReferendaListItem(item, tracks)
          ),
        },
        {
          category: "Fellowship",
          items: (overview?.gov2?.fellowshipReferenda ?? []).map((item) =>
            toFellowshipReferendaListItem(item, fellowshipTracks)
          ),
        },
      ]
    );
  }

  overviewData.push(
    ...[
      {
        category: "Referenda",
        items: (overview?.democracy?.referenda ?? []).map((item) =>
          toReferendaListItem(chain, item)
        ),
      },
      {
        category: "Democracy External Proposals",
        items: (overview?.democracy?.externals ?? []).map((item) =>
          toExternalProposalListItem(chain, item)
        ),
      },
      {
        category: "Democracy Public Proposals",
        items: (overview?.democracy?.proposals ?? []).map((item) =>
          toPublicProposalListItem(chain, item)
        ),
      },
      {
        category: "Discussions",
        items: (overview?.discussions ?? []).map((item) =>
          toDiscussionListItem(chain, item)
        ),
      },
      {
        category: "Council Motions",
        items: (overview?.council?.motions ?? []).map((item) =>
          toCouncilMotionListItem(chain, item)
        ),
      },
      {
        category: "Tech. Comm. Proposals",
        items: (overview?.techComm?.motions ?? []).map((item) =>
          toTechCommMotionListItem(chain, item)
        ),
      },
    ]
  );

  if (isKarura) {
    overviewData.push({
      category: "Financial Council Motions",
      items: (overview?.financialCouncil?.motions ?? []).map((item) =>
        toFinancialMotionsListItem(chain, item)
      ),
    });
  }

  overviewData.push(
    ...[
      {
        category: "Treasury Proposals",
        items: (overview?.treasury?.proposals ?? []).map((item) =>
          toTreasuryProposalListItem(chain, item)
        ),
      },
      {
        category: "Treasury Bounties",
        items: (overview?.treasury?.bounties ?? []).map((item) =>
          toTreasuryBountyListItem(chain, item)
        ),
      },
      {
        category: "Tips",
        items: (overview?.treasury?.tips ?? []).map((item) =>
          toTipListItem(chain, item)
        ),
      },
    ]
  );

  if (chain === "kabocha") {
    overviewData = [
      {
        category: "Discussions",
        items: (overview?.discussions ?? []).map((item) =>
          toDiscussionListItem(chain, item)
        ),
      },
    ];
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
        summaryData={overview.summary}
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
