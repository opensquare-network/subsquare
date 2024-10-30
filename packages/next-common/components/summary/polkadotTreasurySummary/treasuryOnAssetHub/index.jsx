import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import { usePolkadotTreasurySummary } from "../context";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { StatemintFellowShipSalaryAccount } from "../hook/useSubscribeFellowshipSalaryBalance";

function TreasurySummary({ multiAssetsFree, USDtBalance, USDCBalance }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex gap-[4px] text12Medium text-textPrimary">
        <Link
          className="text12Medium"
          href={`https://assethub-polkadot.subscan.io/account/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Treasury</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
        <FiatPriceLabel
          free={multiAssetsFree}
          USDCBalance={USDCBalance}
          USDtBalance={USDtBalance}
        />
      </div>
      <div className="!ml-0 flex flex-col gap-y-1">
        <DotTokenSymbolAsset free={multiAssetsFree} />
        <TokenSymbolAsset
          amount={toPrecision(USDCBalance, SYMBOL_DECIMALS.USDC)}
          symbol="USDC"
        />
        <TokenSymbolAsset
          amount={toPrecision(USDtBalance, SYMBOL_DECIMALS.USDT)}
          symbol="USDt"
        />
      </div>
    </div>
  );
}

function FellowshipSubItem({ name, href, children }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <Link
        className="text12Medium"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <i className="text-textTertiary">↳&nbsp;</i>
        <span className="text-textTertiary hover:underline">{name}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Link>
      <div className="flex ml-[16px]">{children}</div>
    </div>
  );
}

function FellowshipSummary({ fellowshipFree, fellowshipSalaryUsdtBalance }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex gap-[4px] text12Medium text-textPrimary">
        <span className="text-textTertiary">Fellowship</span>
        <FiatPriceLabel
          free={fellowshipFree}
          USDtBalance={fellowshipSalaryUsdtBalance}
        />
      </div>
      <FellowshipSubItem
        name="Treasury"
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipTreasuryAccount}`}
      >
        <DotTokenSymbolAsset free={fellowshipFree} />
      </FellowshipSubItem>
      <FellowshipSubItem
        name="Salary"
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipSalaryAccount}`}
      >
        <TokenSymbolAsset
          amount={toPrecision(
            fellowshipSalaryUsdtBalance,
            SYMBOL_DECIMALS.USDT,
          )}
          symbol="USDt"
        />
      </FellowshipSubItem>
    </div>
  );
}

export default function TreasuryOnAssetHub() {
  const {
    multiAssetsFree,
    USDtBalance,
    USDCBalance,
    isMultiAssetsLoading,
    fellowshipFree,
    isFellowshipLoading,
    fellowshipSalaryUsdtBalance,
    isFellowshipSalaryUsdtBalanceLoading,
  } = usePolkadotTreasurySummary();

  const totalUSDtBalance = new BigNumber(USDtBalance)
    .plus(fellowshipSalaryUsdtBalance)
    .toString();

  return (
    <SummaryItem title="Asset Hub">
      <LoadableContent
        isLoading={
          isMultiAssetsLoading ||
          isFellowshipLoading ||
          isFellowshipSalaryUsdtBalanceLoading
        }
      >
        <div className="flex flex-col gap-[16px]">
          <FiatPriceLabel
            free={new BigNumber(fellowshipFree)
              .plus(multiAssetsFree)
              .toString()}
            USDtBalance={totalUSDtBalance}
            USDCBalance={USDCBalance}
          />
          <TreasurySummary
            multiAssetsFree={multiAssetsFree}
            USDtBalance={USDtBalance}
            USDCBalance={USDCBalance}
          />
          <FellowshipSummary
            fellowshipFree={fellowshipFree}
            fellowshipSalaryUsdtBalance={fellowshipSalaryUsdtBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
