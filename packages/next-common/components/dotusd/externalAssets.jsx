import { isNil } from "lodash-es";
import { cn, toPrecision } from "next-common/utils";
import StyledList from "next-common/components/styledList";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import TokenIcon from "next-common/components/assethubMigrationAssets/swap/components/tokenIcon";
import { Location } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/id";
import { formatPercent, permillToPercent } from "./psmUtils";
import { useDotUsdContext } from "./context";

// Matches the value style of the PSM instance panel (text14Medium on textPrimary).
const VALUE_CLASS = "text14Medium text-textPrimary";

// The circuit breaker is a three state enum in the pallet; the tooltips carry the
// explanations documented on `frame/psm`'s CircuitBreakerLevel.
const STATUS_CONFIG = {
  AllEnabled: {
    text: "All enabled",
    className: "text-green500 bg-green100",
    tooltip: "Normal operation, all swaps enabled.",
  },
  MintingDisabled: {
    text: "Minting disabled",
    className: "text-orange500 bg-orange100",
    tooltip: "Minting disabled, redemptions still allowed.",
  },
  AllDisabled: {
    text: "All disabled",
    className: "text-red500 bg-red100",
    tooltip: "All swaps disabled.",
  },
};

function StatusChip({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    text: status ?? "—",
    className: "text-textTertiary bg-neutral200",
  };

  const chip = (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text12Medium whitespace-nowrap",
        config.className,
      )}
    >
      {config.text}
    </span>
  );

  if (!config.tooltip) {
    return chip;
  }

  return (
    <Tooltip content={config.tooltip} contentClassName="max-w-[260px]">
      {chip}
    </Tooltip>
  );
}

function AssetCell({ asset }) {
  return (
    <span className={cn("inline-flex items-center gap-x-2", VALUE_CLASS)}>
      <TokenIcon token={{ assetId: asset.index, symbol: asset.symbol }} />
      <span>{asset.symbol}</span>
      <Location location={asset.location} />
    </span>
  );
}

function AmountValue({ value, symbol, decimals }) {
  if (isNil(value)) {
    return <span className="text14Medium text-textTertiary">—</span>;
  }

  return (
    <ValueDisplay
      className={VALUE_CLASS}
      value={toPrecision(value, decimals)}
      symbol={symbol}
    />
  );
}

function PercentValue({ value }) {
  const text = formatPercent(value);

  return (
    <span className={cn("num", VALUE_CLASS, !text && "text-textTertiary")}>
      {text ?? "—"}
    </span>
  );
}

function UtilizationCell({ value }) {
  if (isNil(value)) {
    return "—";
  }

  const percent = Number(value);
  const overCap = percent > 100;

  return (
    <span className={cn("inline-flex flex-col items-start gap-y-1", VALUE_CLASS)}>
      <span className={cn("num", overCap && "text-red500")}>
        {formatPercent(value, 2)}
      </span>
      <span className="h-1 w-16 rounded-full bg-neutral300">
        <span
          className={cn(
            "block h-full rounded-full",
            overCap ? "bg-red500" : "bg-theme500",
          )}
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </span>
    </span>
  );
}

// A `th` centres its content by default, so every column states its alignment.
const columns = [
  { name: "Asset", className: "text-left" },
  { name: "Status", className: "text-left" },
  { name: "Weight", className: "text-left" },
  { name: "Effective cap", className: "text-left" },
  { name: "Minted debt", className: "text-left" },
  { name: "Utilization", className: "text-left" },
  { name: "Mint fee", className: "text-left" },
  { name: "Redeem fee", className: "text-right" },
];

export default function DotUsdExternalAssets() {
  const { data, isLoading } = useDotUsdContext();
  const { symbol, decimals } = data?.internalAsset ?? {};

  const rows = (data?.externals ?? []).map((asset) => [
    <AssetCell key="asset" asset={asset} />,
    <StatusChip key="status" status={asset.status} />,
    <PercentValue key="weight" value={permillToPercent(asset.weight)} />,
    <AmountValue
      key="cap"
      value={asset.cap}
      symbol={symbol}
      decimals={decimals}
    />,
    <AmountValue
      key="debt"
      value={asset.debt}
      symbol={symbol}
      decimals={decimals}
    />,
    <UtilizationCell key="utilization" value={asset.utilization} />,
    <PercentValue key="mint-fee" value={asset.mintingFee} />,
    <PercentValue key="redeem-fee" value={asset.redemptionFee} />,
  ]);

  return (
    <StyledList
      columns={columns}
      rows={rows}
      loading={isLoading}
      noDataText="No approved external assets"
    />
  );
}
