import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import LoadableContent from "next-common/components/common/loadableContent";
import FieldLoading from "next-common/components/icons/fieldLoading";
import {
  ACTIVE_STATUSES,
  useMultiAssetBountiesSummary,
} from "next-common/hooks/treasury/multiAssetBounty/useMultiAssetBountiesSummary";
import { isNil } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useContextPapi } from "next-common/context/papi";
import { toPrecision } from "next-common/utils";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import { useChainSettings } from "next-common/context/chain";

const STATUS_TITLES = [
  {
    title: "Inactive Bounties",
    status: ["Created", "Funded"],
    tooltip: "Bounties approved by governance and awaiting curator acceptance.",
  },
  {
    title: "Active Bounties",
    status: ["Active"],
    tooltip: "Bounties that are currently active and in progress.",
  },
];

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
        {STATUS_TITLES.map((titleStatus) => {
          const group = {
            count: 0,
            byAsset: {},
          };
          for (const status of titleStatus.status) {
            if (!ACTIVE_STATUSES.includes(status)) {
              return null;
            }
            const item = (groupedByStatus || {})[status] || {
              count: 0,
              byAsset: {},
            };
            group.count += item.count || 0;
            for (const [key, assetData] of Object.entries(item.byAsset)) {
              if (!group.byAsset[key]) {
                group.byAsset[key] = { ...assetData };
              } else {
                group.byAsset[key] = {
                  ...group.byAsset[key],
                  total: group.byAsset[key].total.plus(assetData.total),
                };
              }
            }
          }
          const titleNode = (
            <div className="flex items-center gap-1">
              <span>{titleStatus.title}</span>
              {titleStatus.tooltip && <Tooltip content={titleStatus.tooltip} />}
            </div>
          );
          return (
            <SummaryItem key={titleStatus.title} title={titleNode}>
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
