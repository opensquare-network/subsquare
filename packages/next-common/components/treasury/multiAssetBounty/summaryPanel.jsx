import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { useMultiAssetBountiesSummary } from "next-common/hooks/treasury/multiAssetBounty/useMultiAssetBountiesSummary";
import { isNil } from "lodash-es";
import { useContextPapi } from "next-common/context/papi";
import { toPrecision } from "next-common/utils";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import { useChainSettings } from "next-common/context/chain";

const ACTIVE_STATUSES = ["Active", "Funded", "CuratorUnassigned"];

const STATUS_TITLES = {
  Active: "Active Bounties",
  Funded: "Funded Bounties",
  CuratorUnassigned: "Created Bounties",
};

function StatusAssets({ byAsset }) {
  const { symbol: chainSymbol } = useChainSettings();
  const entries = Object.values(byAsset);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-1 !ml-0">
      {entries.map(({ symbol, decimals, total }) =>
        symbol === chainSymbol ? (
          <NativeTokenSymbolAsset key={symbol} free={total.toFixed()} />
        ) : (
          <TokenSymbolAsset
            key={symbol}
            amount={toPrecision(total.toFixed(), decimals)}
            symbol={symbol}
          />
        ),
      )}
    </div>
  );
}

export function MultiAssetBountiesSummaryPanelImpl() {
  const { groupedByStatus, isLoading } = useMultiAssetBountiesSummary();

  return (
    <LoadableContent isLoading={isLoading || isNil(groupedByStatus)}>
      <SummaryLayout>
        {ACTIVE_STATUSES.map((status) => {
          const group = (groupedByStatus || {})[status] || {
            count: 0,
            byAsset: {},
          };
          return (
            <SummaryItem key={status} title={STATUS_TITLES[status]}>
              <div className="flex flex-col gap-y-1">
                <span>{group.count}</span>
                <StatusAssets byAsset={group.byAsset} />
              </div>
            </SummaryItem>
          );
        })}
      </SummaryLayout>
    </LoadableContent>
  );
}

export default function MultiAssetBountiesSummaryPanel() {
  const { api: papi, checkPallet } = useContextPapi();

  if (!papi) {
    return <FieldLoading />;
  }

  if (!checkPallet("MultiAssetBounties", "Bounties")) {
    return null;
  }

  return <MultiAssetBountiesSummaryPanelImpl />;
}
