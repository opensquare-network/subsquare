import SummaryItem from "next-common/components/summary/layout/item";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import LoadableContent from "next-common/components/common/loadableContent";
// import Link from "next/link";
import FiatPriceLabel from "../common/fiatPriceLabel";
import useQueryAssetHubForeignAssets from "next-common/hooks/assetHub/useQueryAssetHubForeignAssets";

const MythTokenAccount = "13gYFscwJFJFqFMNnttzuTtMrApUEmcUARtgFubbChU9g6mh";

export default function MythToken() {
  const { isLoading, balance } =
    useQueryAssetHubForeignAssets(MythTokenAccount);

  return (
    <SummaryItem title="Myth Token">
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel mythTokenBalance={balance} />
          <div className="flex flex-col gap-[4px]">
            <div className="!ml-0 flex flex-col gap-y-1">
              <TokenSymbolAsset
                amount={toPrecision(balance, SYMBOL_DECIMALS.MYTH)}
                symbol="MYTH"
              />
            </div>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
