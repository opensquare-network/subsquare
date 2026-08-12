import { isHydrationChain } from "next-common/utils/chain";

export const DOT_SYMBOL = "DOT";
export const USDC_SYMBOL = "USDC";
export const USDT_SYMBOL = "USDT";

export const TRANSFER_SYMBOLS = [DOT_SYMBOL, USDC_SYMBOL, USDT_SYMBOL];

// Asset Hub is the reserve of every transferable asset here: DOT is its native
// token and USDC/USDT are local assets of its `assets` pallet. On Hydration
// they are all foreign assets of the `tokens` pallet, addressed by the
// per-asset ids below.
//
// Asset ids / decimals / XCM locations are verified against the real chains
// and the Galactic Council xc-cfg route data (Asset Hub assetsData and
// Hydration assetsData).
export const TRANSFER_ASSETS = {
  [DOT_SYMBOL]: {
    decimals: 10,
    // foreign asset id in Hydration's tokens pallet
    hydrationAssetId: 5,
    // asset id in Asset Hub's assets pallet (null when native there)
    assetHubAssetId: null,
  },
  [USDC_SYMBOL]: {
    decimals: 6,
    hydrationAssetId: 22,
    assetHubAssetId: 1337,
  },
  [USDT_SYMBOL]: {
    decimals: 6,
    hydrationAssetId: 10,
    assetHubAssetId: 1984,
  },
};

export const getTransferAsset = (symbol) => TRANSFER_ASSETS[symbol];

// Destination chain fee for the Asset Hub -> Hydration direction. These are
// the fixed values declared in the Galactic Council xc-cfg route configs
// (packages/xc-cfg/src/configs/polkadot/assethub/index.ts), denominated in
// the transferred asset and deducted on Hydration to execute the incoming XCM.
// The reverse direction (Hydration -> Asset Hub) has no fixed value; it is
// queried dynamically via XcmPaymentApi on Asset Hub (see
// useHydrationCrossChainFees.js).
export const HUB_TO_HYDRATION_DESTINATION_FEES = {
  [DOT_SYMBOL]: { amount: 10000000n, decimals: 10 }, // 0.001 DOT
  [USDC_SYMBOL]: { amount: 20000n, decimals: 6 }, // 0.02 USDC
  [USDT_SYMBOL]: { amount: 20000n, decimals: 6 }, // 0.02 USDT
};

// XCM location of the transferred asset, as seen from the source chain.
//
// - DOT is the relay native: `{ parents: 1, interior: Here }` on both chains.
// - USDC/USDT are local assets of Asset Hub's assets pallet (PalletInstance
//   50). From Asset Hub they are local (`parents: 0`), from Hydration they are
//   reached through the asset's parachain (`parents: 1, X3(Parachain(1000),
//   PalletInstance(50), GeneralIndex(id))`).
export function getTransferAssetLocation({ sourceChain, symbol }) {
  const asset = getTransferAsset(symbol);
  const assetHubAssetId = asset?.assetHubAssetId;

  if (assetHubAssetId == null) {
    return { parents: 1, interior: "Here" };
  }

  if (isHydrationChain(sourceChain)) {
    return {
      parents: 1,
      interior: {
        X3: [
          { Parachain: 1000 },
          { PalletInstance: 50 },
          { GeneralIndex: assetHubAssetId },
        ],
      },
    };
  }

  return {
    parents: 0,
    interior: {
      X2: [{ PalletInstance: 50 }, { GeneralIndex: assetHubAssetId }],
    },
  };
}

// Resolves the existential deposit (or the equivalent minimum balance) of the
// transferred asset on the destination chain.
export function getDestinationExistentialDeposit({
  destinationApi,
  destinationChain,
  symbol,
}) {
  const asset = getTransferAsset(symbol);

  if (isHydrationChain(destinationChain)) {
    // On Hydration the per-asset ED is exposed by the assetRegistry pallet.
    const query = destinationApi.query.assetRegistry?.assets;
    return query
      ? query(asset.hydrationAssetId).then((res) => {
          // assets() returns an Option; the field is only reachable after
          // unwrapping it.
          const ed = res?.isSome ? res.unwrap().existentialDeposit : null;
          return ed?.toJSON?.() ?? ed?.toString?.() ?? null;
        })
      : Promise.resolve(null);
  }

  if (asset.assetHubAssetId != null) {
    // USDC/USDT live in Asset Hub's assets pallet; the per-asset min balance
    // plays the role of the existential deposit on the destination.
    const query = destinationApi.query.assets?.asset;
    return query
      ? query(asset.assetHubAssetId).then((res) => {
          // asset() returns an Option; the field is only reachable after
          // unwrapping it.
          const minBalance = res?.isSome ? res.unwrap().minBalance : null;
          return minBalance?.toJSON?.() ?? minBalance?.toString?.() ?? null;
        })
      : Promise.resolve(null);
  }

  // DOT is native on Asset Hub; its ED is the balances pallet's constant.
  return Promise.resolve(
    destinationApi.consts.balances?.existentialDeposit?.toJSON?.() ?? null,
  );
}
