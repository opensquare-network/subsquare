/**
 * Known Hydration (hydradx) token assets with bundled icons.
 *
 * Only a few important treasury assets carry dedicated `AssetIcon*` components
 * from `@osn/icons`. Symbols missing from this list (or without an icon) fall
 * back to the shared `AssetIconPlaceholder`, handled by the `AssetIcon`
 * component.
 *
 * GETH, Hollar shares (HUSDT, HUSDC, HEURC) and gSOL reuse the underlying
 * asset's icon (ETH, USDT, USDC, EURC, SOL), so their entries point at the
 * same component.
 */
import {
  AssetIconDot,
  AssetIconEurc,
  AssetIconHdx,
  AssetIconHollar,
  AssetIconSol,
  AssetIconUsdc,
  AssetIconUsdt,
  AssetIconWbtc,
  AssetIconWeth,
} from "@osn/icons/subsquare";

const knownHydrationAssets = [
  { symbol: "HDX", assetId: 0, icon: AssetIconHdx },
  { symbol: "atBTC", assetId: 1006, icon: AssetIconWbtc },
  { symbol: "GETH", assetId: 420, icon: AssetIconWeth },
  { symbol: "HEURC", assetId: 4444, icon: AssetIconEurc },
  { symbol: "DOT", assetId: 5, icon: AssetIconDot },
  { symbol: "GSOL", assetId: 9001, icon: AssetIconSol },
  { symbol: "HOLLAR", assetId: 222, icon: AssetIconHollar },
  { symbol: "HUSDT", assetId: 1111, icon: AssetIconUsdt },
  { symbol: "HUSDC", assetId: 1110, icon: AssetIconUsdc },
  { symbol: "USDT", assetId: 10, icon: AssetIconUsdt },
  { symbol: "USDC", assetId: 22, icon: AssetIconUsdc },
];

export default knownHydrationAssets;
