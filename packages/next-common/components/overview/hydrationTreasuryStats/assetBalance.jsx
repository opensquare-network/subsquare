import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next-common/components/link";
import SummaryItem from "next-common/components/summary/layout/item";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import { HYDRATION_TREASURY_ACCOUNT } from "next-common/hooks/useHydrationTreasuryAssets";
import BigNumber from "bignumber.js";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

const HYDRATION_TREASURY_WALLET_URL = `https://app.hydration.net/wallet/assets?account=${HYDRATION_TREASURY_ACCOUNT}&category=assets&assetsSort=%5B%5D&bondsSort=%5B%7B%22id%22%3A%22total%22%2C%22desc%22%3Atrue%7D%5D&liquiditySort=%5B%7B%22id%22%3A%22currentValue%22%2C%22desc%22%3Atrue%7D%5D`;

function TokenWrappper({ children }) {
  return (
    <div className="bg-neutral200 py-1 px-2 rounded-[4px]">{children}</div>
  );
}

export default function HydrationAssetBalance({ data, isLoading }) {
  const { price } = useFiatPriceSnapshot();

  const assetsTotal = new BigNumber(data?.assetsTotal || 0);
  const assets = data?.assets ?? [];

  return (
    <SummaryItem title="Assets Balance">
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-2">
          <FiatPriceLabel
            free={0}
            usdcBalance={0}
            usdtBalance={assetsTotal
              .times(10 ** SYMBOL_DECIMALS.USDT)
              .toFixed(0)}
            fiatPrice={price ?? 1}
          />
          <div className="ml-0! flex flex-wrap gap-2 items-center">
            {assets.map((asset) => (
              <TokenWrappper key={asset.id}>
                <TokenSymbolAsset
                  amount={asset.balance.toString()}
                  symbol={asset.symbol}
                  type={asset.isNative ? "native" : ""}
                />
              </TokenWrappper>
            ))}
            <Link
              className="text12Medium"
              href={HYDRATION_TREASURY_WALLET_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-textTertiary hover:underline">More</span>
              <i className="text-textTertiary">&nbsp;↗</i>
            </Link>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
