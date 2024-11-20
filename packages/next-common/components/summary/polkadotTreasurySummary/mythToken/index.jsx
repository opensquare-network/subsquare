import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import FiatPriceLabel from "../common/fiatPriceLabel";
import {
  useMythTokenAssets,
  MythTokenAccount,
} from "../context/mythTokenAssets";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";
import ValueDisplay from "next-common/components/valueDisplay";

const AssetIconMyth = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconMyth"),
);

export function MythTokenAsset({ balance, className }) {
  return (
    <div className="flex items-center gap-x-2">
      <AssetIconMyth className="w-4 h-4" />
      <ValueDisplay
        value={toPrecision(balance, 18)}
        symbol={"MYTH"}
        className={cn("text12Medium text-textTertiary", className)}
        tooltipClassName={"inline-flex items-center"}
      />
    </div>
  );
}

export default function MythToken() {
  const { isLoading, mythTokenBalance } = useMythTokenAssets();

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
