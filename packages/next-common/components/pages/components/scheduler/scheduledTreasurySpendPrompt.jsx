import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import useScheduledSpends from "next-common/hooks/useScheduledSpends";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import useSchedulerAgendas from "next-common/hooks/useSchedulerAgendas";
import { SystemClose } from "@osn/icons/subsquare";
import { CACHE_KEY } from "next-common/utils/constants";
import usePromptVisibility from "next-common/hooks/usePromptVisibility";

const ASSET_HUB_GENERAL_INDEX_SYMBOL = {
  1984: "USDT",
  1337: "USDC",
};

function extractPapiJunctions(interior) {
  if (!interior) return [];
  if (interior === "Here") return [];
  if (interior.type === "Here") return [];
  const val = interior.value;
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function getAssetInfoFromPapiAssetKind(
  papiAssetKind,
  chainDecimals,
  chainSymbol,
) {
  if (!papiAssetKind) return { symbol: chainSymbol, decimals: chainDecimals };

  const versionedData = papiAssetKind.value;
  if (!versionedData) return { symbol: chainSymbol, decimals: chainDecimals };

  // V3: asset_id has Concrete/Abstract wrapper; V4+: asset_id is a plain location
  let assetIdLocation = versionedData.asset_id ?? versionedData.assetId;
  if (
    assetIdLocation?.type === "Concrete" ||
    assetIdLocation?.type === "Abstract"
  ) {
    assetIdLocation = assetIdLocation.value;
  }

  const junctions = extractPapiJunctions(assetIdLocation?.interior);
  const palletInstanceJunction = junctions.find(
    (j) => j.type === "PalletInstance",
  );
  const generalIndexJunction = junctions.find((j) => j.type === "GeneralIndex");

  if (palletInstanceJunction && generalIndexJunction) {
    const palletInstance = String(palletInstanceJunction.value);
    const generalIndex = String(generalIndexJunction.value);
    if (palletInstance === "50") {
      const symbol = ASSET_HUB_GENERAL_INDEX_SYMBOL[generalIndex] ?? null;
      if (symbol) {
        return { symbol, decimals: SYMBOL_DECIMALS[symbol] ?? chainDecimals };
      }
    }
  }

  return { symbol: chainSymbol, decimals: chainDecimals };
}

function groupSpendsByAsset(spends, chainDecimals, chainSymbol) {
  const groups = {}; // symbol -> { totalAmount: bigint, decimals }

  for (const spend of spends) {
    let symbol, decimals;
    if (spend.isSpendLocal) {
      symbol = chainSymbol;
      decimals = chainDecimals;
    } else {
      const info = getAssetInfoFromPapiAssetKind(
        spend.assetKind,
        chainDecimals,
        chainSymbol,
      );
      symbol = info.symbol;
      decimals = info.decimals;
    }

    if (!groups[symbol]) {
      groups[symbol] = { totalAmount: 0n, decimals };
    }
    groups[symbol].totalAmount += BigInt(spend.amount);
  }

  return Object.entries(groups).map(([symbol, { totalAmount, decimals }]) => ({
    symbol,
    totalAmount,
    decimals,
  }));
}

function ScheduledTreasurySpendPromptContent({
  agendas,
  agendasLoading,
  onClose,
}) {
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const {
    data: spends,
    count,
    loading,
  } = useScheduledSpends(agendas, agendasLoading);

  if (loading || count === 0) return null;

  const groups = groupSpendsByAsset(spends, chainDecimals, chainSymbol);

  return (
    <GreyPanel className="px-4 py-2.5 text-textPrimary text14Medium justify-between">
      <div className="flex flex-wrap items-center gap-x-2">
        <span>Scheduled Treasury Spends:</span>
        <span className="font-bold">{count}</span>
        <span>·</span>
        {groups.map(({ symbol, totalAmount, decimals }) => (
          <ValueDisplay
            key={symbol}
            value={toPrecision(totalAmount.toString(), decimals)}
            symbol={symbol}
          />
        ))}
      </div>
      <SystemClose
        className="w-5 h-5 flex-shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

export default function ScheduledTreasurySpendPrompt({
  agendas,
  agendasLoading,
  cacheKey = CACHE_KEY.scheduledTreasurySpendPromptOnScheduler,
}) {
  const { visible, handleClose } = usePromptVisibility(cacheKey, true);
  if (!visible) return null;

  return (
    <ScheduledTreasurySpendPromptContent
      agendas={agendas}
      agendasLoading={agendasLoading}
      onClose={handleClose}
    />
  );
}

/**
 * Self-contained variant — fetches scheduler agendas internally.
 * Must be rendered inside a PapiProvider.
 */
export function SelfContainedScheduledTreasurySpendPrompt({
  cacheKey = CACHE_KEY.scheduledTreasurySpendPromptOnScheduler,
}) {
  const { data: agendas, loading: agendasLoading } = useSchedulerAgendas();
  return (
    <ScheduledTreasurySpendPrompt
      agendas={agendas}
      agendasLoading={agendasLoading}
      cacheKey={cacheKey}
    />
  );
}
