import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import { SystemQuestion, SystemSwitch } from "@osn/icons/subsquare";
import { toPrecision, abbreviateBigNumber } from "next-common/utils";

const ROLE_LABELS = {
  transfer: "Transfer",
  swap_in: "Swap out",
  swap_out: "Swap in",
  trapped: "Trapped",
};

function groupAssets(assets = []) {
  const transfers = [];
  const swapPairs = {};
  const trappeds = [];

  for (const asset of assets) {
    const role = asset?.role ?? "transfer";

    if (role === "transfer") {
      transfers.push(asset);
    } else if (role === "swap_in" || role === "swap_out") {
      const sequence = asset?.sequence ?? -1;
      if (!swapPairs[sequence]) {
        swapPairs[sequence] = {};
      }
      swapPairs[sequence][role] = asset;
    } else if (role === "trapped") {
      trappeds.push(asset);
    }
  }

  transfers.sort((a, b) => Number(b?.usd ?? 0) - Number(a?.usd ?? 0));

  return {
    transfers,
    swapPairs: Object.values(swapPairs),
    trappeds,
  };
}

function AssetAmount({ asset, children }) {
  const value = toPrecision(asset?.amount ?? 0, asset?.decimals);
  const usd = Number(asset?.usd);
  const hasUsd = Number.isFinite(usd);
  const label = ROLE_LABELS[asset?.role];

  const content = (
    <span className="flex flex-col items-end">
      <ValueDisplay value={value} symbol={asset?.symbol} showTooltip={false} />
      {children}
    </span>
  );

  return (
    <Tooltip
      content={
        <span>
          {label ? `${label}: ` : null}
          {value} {asset?.symbol}
          {hasUsd ? ` ( ≈ $${abbreviateBigNumber(usd)} )` : null}
        </span>
      }
    >
      {content}
    </Tooltip>
  );
}

function SwapRow({ swapIn, swapOut }) {
  return (
    <div className="flex items-center gap-x-1.5">
      <AssetAmount asset={swapIn} />
      <SystemSwitch className="h-4 w-4 shrink-0 text-textTertiary" />
      <AssetAmount asset={swapOut} />
    </div>
  );
}

function TrappedRow({ asset }) {
  return (
    <div className="flex items-center gap-x-1.5">
      <AssetAmount asset={asset} />
      <Tooltip content="Assets stuck while being delivered. They can be recovered via a claim.">
        <SystemQuestion className="h-4 w-4 shrink-0 text-textTertiary" />
      </Tooltip>
    </div>
  );
}

export default function AssetCell({ assets = [] }) {
  const { transfers, swapPairs, trappeds } = groupAssets(assets);

  const rows = [
    ...transfers.map((asset, index) => (
      <AssetAmount key={`transfer-${index}`} asset={asset} />
    )),
    ...swapPairs
      .filter(({ swap_in, swap_out }) => swap_in && swap_out)
      .map(({ swap_in, swap_out }, index) => (
        <SwapRow key={`swap-${index}`} swapIn={swap_in} swapOut={swap_out} />
      )),
    ...trappeds.map((asset, index) => (
      <TrappedRow key={`trapped-${index}`} asset={asset} />
    )),
  ];

  if (rows.length === 0) {
    return "-";
  }

  return <div className="flex flex-col items-end gap-y-1">{rows}</div>;
}
