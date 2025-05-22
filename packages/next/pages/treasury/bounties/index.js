import PostList from "next-common/components/postList";
import { withCommonProps } from "next-common/lib";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import { useChainSettings } from "next-common/context/chain";
import { lowerCase } from "lodash-es";
import ListLayout from "next-common/components/layout/ListLayout";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { TreasuryProvider } from "next-common/context/treasury";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";
import NewBountyButton from "next-common/components/treasury/bounty/newBountyButton";
import { backendApi } from "next-common/services/nextApi";
import BountyPanel from "next-common/components/treasury/bounty/bountyPanel";

export default function BountiesPage({
  activeBounties,
  inactiveBounties,
  chain,
}) {
  const chainSettings = useChainSettings();

  const items = (inactiveBounties.items || []).map((item) =>
    normalizeBountyListItem(chain, item),
  );
  const category = "Treasury Bounties";
  const seoInfo = { title: category, desc: category };

  const treasurySummaryPanel = isPolkadotChain(chain) ? (
    <PolkadotTreasuryStatsOnProposal />
  ) : (
    <TreasurySummary />
  );

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
          chainSettings.integrations?.doTreasury && {
            value: "statistics",
            label: "Statistics",
            url: `https://dotreasury.com/${lowerCase(
              chainSettings.symbol,
            )}/bounties`,
          },
        ].filter(Boolean)}
      >
        {activeBounties && activeBounties.length > 0 && (
          <BountyPanel category={category} activeBounties={activeBounties} />
        )}
        <PostList
          category={category}
          title="List"
          titleCount={inactiveBounties.total}
          titleExtra={<NewBountyButton />}
          items={items}
          pagination={{
            page: inactiveBounties.page,
            pageSize: inactiveBounties.pageSize,
            total: inactiveBounties.total,
          }}
        />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [
    tracksProps,
    { result: activeBounties },
    { result: inactiveBounties },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch("/treasury/bounties/active"),
    backendApi.fetch("/treasury/bounties/inactive"),
  ]);

  return {
    props: {
      activeBounties,
      inactiveBounties,
      ...tracksProps,
    },
  };
});
