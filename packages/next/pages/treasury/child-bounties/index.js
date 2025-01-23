import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import { toTreasuryChildBountyListItem } from "next-common/utils/viewfuncs";
import { useChain, useChainSettings } from "next-common/context/chain";
import { lowerCase } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { fetchList } from "next-common/services/list";
import { isNil } from "lodash-es";
import { TreasuryProvider } from "next-common/context/treasury";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";
import PolkadotTreasuryProvider from "next-common/context/treasury/polkadotTreasury";

export default function ChildBountiesPage({ bounties }) {
  const chainSettings = useChainSettings();
  const chain = useChain();

  const items = (bounties.items || []).map((item) =>
    toTreasuryChildBountyListItem(item),
  );
  const category = "Treasury Child Bounties";
  const seoInfo = { title: category, desc: category };

  const treasurySummaryPanel = isPolkadotChain(chain) ? (
    <PolkadotTreasuryStatsOnProposal />
  ) : (
    <TreasurySummary />
  );

  return (
    <TreasuryProvider>
      <PolkadotTreasuryProvider>
        <ListLayout
          seoInfo={seoInfo}
          title={category}
          summary={treasurySummaryPanel}
          tabs={[
            {
              value: "child_bounties",
              label: "Child Bounties",
              url: "/treasury/child-bounties",
            },
            chainSettings.integrations?.doTreasury && {
              value: "statistics",
              label: "Statistics",
              url: `https://dotreasury.com/${lowerCase(
                chainSettings.symbol,
              )}/child-bounties`,
            },
          ].filter(Boolean)}
        >
          <PostList
            category={category}
            title="List"
            titleCount={bounties.total}
            items={items}
            pagination={{
              page: bounties.page,
              pageSize: bounties.pageSize,
              total: bounties.total,
            }}
          />
        </ListLayout>
      </PolkadotTreasuryProvider>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { parentBountyId } = context.query;
  const params = isNil(parentBountyId) ? null : { parent: parentBountyId };
  const bounties = await fetchList("treasury/child-bounties", context, params);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      bounties,
      ...tracksProps,
    },
  };
});
