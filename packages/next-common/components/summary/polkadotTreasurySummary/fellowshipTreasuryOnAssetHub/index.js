import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import { usePolkadotTreasurySummary } from "../context";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { StatemintFellowShipSalaryAccount } from "../hook/useSubscribeFellowshipSalaryBalance";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";

function FellowshipTreasuryItem({ name, href, children }) {
  return (
    <div className="flex gap-[4px]">
      <Link
        className="text12Medium"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <span className="text-textTertiary hover:underline">{name}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Link>
      <div className="flex">{children}</div>
    </div>
  );
}

function FellowshipTreasuryItemList({
  fellowshipFree,
  fellowshipSalaryUsdtBalance,
}) {
  const { decimals, symbol } = useChainSettings();
  const fellowshipFreeBalance = toPrecision(fellowshipFree || 0, decimals);

  return (
    <div className="flex flex-col gap-[4px]">
      <FellowshipTreasuryItem
        name="Treasury"
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipTreasuryAccount}`}
      >
        <ValueDisplay
          value={fellowshipFreeBalance}
          symbol={symbol}
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </FellowshipTreasuryItem>
      <FellowshipTreasuryItem
        name="Salary"
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipSalaryAccount}`}
      >
        <ValueDisplay
          value={toPrecision(fellowshipSalaryUsdtBalance, SYMBOL_DECIMALS.USDT)}
          symbol="USDt"
          className={"text12Medium text-textPrimary"}
          tooltipClassName={"inline-flex items-center"}
        />
      </FellowshipTreasuryItem>
    </div>
  );
}

export default function FellowshipTreasuryOnAssetHub() {
  const {
    fellowshipFree,
    isFellowshipLoading,
    fellowshipSalaryUsdtBalance,
    isFellowshipSalaryUsdtBalanceLoading,
  } = usePolkadotTreasurySummary();

  return (
    <SummaryItem title="Fellowship">
      <LoadableContent
        isLoading={isFellowshipLoading || isFellowshipSalaryUsdtBalanceLoading}
      >
        <div className="flex flex-col gap-[16px]">
          <FiatPriceLabel
            free={fellowshipFree}
            USDtBalance={fellowshipSalaryUsdtBalance}
          />
          <FellowshipTreasuryItemList
            fellowshipFree={fellowshipFree}
            fellowshipSalaryUsdtBalance={fellowshipSalaryUsdtBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
