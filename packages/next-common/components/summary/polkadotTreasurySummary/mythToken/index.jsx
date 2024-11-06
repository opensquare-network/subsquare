import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useForeignAssets, MythTokenAccount } from "../context/foreignAssetsOnAssethub";
import TokenSymbolForeignAsset from "../common/tokenSymbolForeignAsset";

export function MythTokenAsset({ balance }) {
  return (
    <TokenSymbolForeignAsset
      amount={toPrecision(balance, SYMBOL_DECIMALS.MYTH)}
      symbol="MYTH"
    />
  );
}

export default function MythToken() {
  const { isLoading, mythTokenBalance } = useForeignAssets();

  return (
    <SummaryItem title="Myth Token">
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel mythTokenBalance={mythTokenBalance} />
          <div className="flex flex-col gap-[4px]">
            <div className="!ml-0 flex flex-col gap-y-1">
              <MythTokenAsset balance={mythTokenBalance} />
              <Link
                className="text12Medium"
                href={`https://assethub-polkadot.subscan.io/account/${MythTokenAccount}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-textTertiary hover:underline">
                  Distribution
                </span>
                <i className="text-textTertiary">&nbsp;↗</i>
              </Link>
            </div>
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
