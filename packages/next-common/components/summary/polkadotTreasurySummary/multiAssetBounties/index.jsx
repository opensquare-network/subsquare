import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next-common/components/link";
import LoadableContent from "next-common/components/common/loadableContent";
import NativeTokenSymbolAsset from "../common/nativeTokenSymbolAsset";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";
import Tooltip from "next-common/components/tooltip";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

const TARGET_LINK = "/treasury/multi-asset-bounties";

export default function MultiAssetBounties() {
  const {
    multiAssetBountiesCount,
    multiAssetBountiesTotalByAsset: totalByAsset,
    isMultiAssetBountiesLoading: isLoading,
  } = usePolkadotTreasury();

  const { symbol: chainSymbol } = useChainSettings();

  const entries = Object.values(totalByAsset || {});

  const Title = (
    <>
      <Link
        href={TARGET_LINK}
        className="text12Medium text-textTertiary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        Multi-Asset Bounties
      </Link>
      {isLoading ? null : (
        <>
          <span>{" · "}</span>
          <Tooltip content="Active multi-asset bounties">
            <span>{multiAssetBountiesCount}</span>
          </Tooltip>
        </>
      )}
    </>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-1">
          <FiatPriceLabel
            free={totalByAsset?.[chainSymbol]?.total?.toFixed() ?? 0}
            usdtBalance={totalByAsset?.USDT?.total?.toFixed() ?? 0}
            usdcBalance={totalByAsset?.USDC?.total?.toFixed() ?? 0}
          />
          <div className="flex flex-col gap-y-1 ml-0!">
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
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
