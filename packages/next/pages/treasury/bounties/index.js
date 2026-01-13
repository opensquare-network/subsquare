import TreasuryBountiesPostList from "next-common/components/postList/treasyrybountiesPostList";
import { withCommonProps } from "next-common/lib";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import ListLayout from "next-common/components/layout/ListLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import { backendApi } from "next-common/services/nextApi";
import BountyCardSection from "next-common/components/treasury/bounty/bountyCardSection";
import { fetchList } from "next-common/services/list";
import businessCategory from "next-common/utils/consts/business/category";
import NewBountyButton from "next-common/components/treasury/bounty/newBountyButton";
import BountiesSummaryPanel from "next-common/components/treasury/bounty/summaryPanel";

export default function BountiesPage({
  activeBounties,
  inactiveBounties,
  chain,
}) {
  const items = (inactiveBounties.items || []).map((item) =>
    normalizeBountyListItem(chain, item),
  );
  const category = businessCategory.treasuryBounties;
  const seoInfo = { title: category, desc: category };

  const treasurySummaryPanel = <BountiesSummaryPanel />;

  return (
    <TreasuryProvider>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        summary={treasurySummaryPanel}
        tabs={[
          {
            value: "bounties",
            label: "Bounties",
            url: "/treasury/bounties",
          },
        ].filter(Boolean)}
      >
        {activeBounties && activeBounties.length > 0 && (
          <BountyCardSection
            category={category}
            activeBounties={activeBounties?.map((item) =>
              normalizeBountyListItem(chain, item),
            )}
          />
        )}
        <TreasuryBountiesPostList
          titleCount={inactiveBounties.total}
          items={items}
          pagination={{
            page: inactiveBounties.page,
            pageSize: inactiveBounties.pageSize,
            total: inactiveBounties.total,
          }}
          titleExtra={<NewBountyButton />}
        />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [tracksProps, { result: activeBounties }, inactiveBounties] =
    await Promise.all([
      fetchOpenGovTracksProps(),
      backendApi.fetch("/treasury/bounties/active"),
      fetchList("/treasury/bounties/inactive", context),
    ]);

  return {
    props: {
      activeBounties,
      inactiveBounties,
      ...tracksProps,
    },
  };
});
