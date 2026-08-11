import { isEthereumAddress } from "@polkadot/util-crypto";
import { isAssetHubChain, isHydrationChain } from "next-common/utils/chain";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

// The transferred asset for every para-chain -> para-chain route is the relay
// native (DOT). Its XCM location is the same on both chains:
// { parents: 1, interior: Here }.
const DOT_ASSET_LOCATION = { parents: 1, interior: "Here" };

// Asset Hub and Hydration support Ethereum-style (H160) accounts, which must
// be addressed via the AccountKey20 XCM junction. Other para chains only
// support AccountId32. The transferToAddress may be a raw H160 (e.g. MetaMask
// input) or a "ETH\0"-prefixed substrate address (which wraps an H160); both
// are normalized to an H160 before encoding.
function getBeneficiaryJunction({ api, destinationChain, transferToAddress }) {
  const supportsEvmAccounts =
    isAssetHubChain(destinationChain) || isHydrationChain(destinationChain);

  if (supportsEvmAccounts) {
    const maybeEvmAddress = tryConvertToEvmAddress(transferToAddress);
    if (isEthereumAddress(maybeEvmAddress)) {
      return {
        AccountKey20: {
          network: null,
          key: maybeEvmAddress,
        },
      };
    }
  }

  return {
    AccountId32: {
      network: null,
      id: api.createType("AccountId32", transferToAddress).toHex(),
    },
  };
}

// Builds the `transferAssetsUsingTypeAndThen` params used to move the relay
// native (DOT) between Asset Hub and HydraDX.
//
// This mirrors Hydration's official implementation (galacticcouncil/xc-cfg):
// the reserve of DOT is Asset Hub, so the transfer type depends on which side
// of the route Asset Hub is on:
// - Asset Hub -> HydraDX: reserve == source -> `localReserve`
// - HydraDX   -> Asset Hub: reserve == dest  -> `destinationReserve`
//
// `transferAssetsUsingTypeAndThen` is required here because `limitedReserve
// TransferAssets` relies on automatic reserve detection, which fails for DOT
// (`InvalidAssetUnknownReserve`): the reserve (Asset Hub) is neither the
// source nor the destination, so it must be spelled out explicitly.
function getTransferAssetsUsingTypeAndThenParams({
  api,
  destinationChain,
  transferToAddress,
  amount,
  paraChainId,
  transferType,
}) {
  return [
    // dest
    {
      V4: {
        parents: 1,
        interior: {
          X1: [
            {
              Parachain: paraChainId,
            },
          ],
        },
      },
    },
    // assets
    {
      V4: [
        {
          id: DOT_ASSET_LOCATION,
          fun: {
            Fungible: amount,
          },
        },
      ],
    },
    // assets_transfer_type
    { [transferType]: null },
    // remote_fees_id (DOT pays for the destination execution fee)
    { V4: DOT_ASSET_LOCATION },
    // fees_transfer_type
    { [transferType]: null },
    // custom_xcm_on_dest: deposit everything remaining after the destination
    // fee into the beneficiary account.
    {
      V4: [
        {
          DepositAsset: {
            assets: {
              Wild: {
                AllCounted: 1,
              },
            },
            beneficiary: {
              parents: 0,
              interior: {
                X1: [
                  getBeneficiaryJunction({
                    api,
                    destinationChain,
                    transferToAddress,
                  }),
                ],
              },
            },
          },
        },
      ],
    },
    // weight_limit
    { unlimited: null },
  ];
}

export default function teleportFromParaChainToParaChain({
  sourceApi,
  sourceChain,
  destinationChain,
  transferToAddress,
  amount,
  paraChainId,
}) {
  // The relay native cannot be teleported when HydraDX is involved: Asset Hub's
  // teleport filter rejects relay-native teleports to non-system parachains
  // (polkadotXcm.Filtered), and HydraDX's own `limitedTeleportAssets` reports a
  // max weight and is rejected by its pool (error 1010). DOT therefore moves via
  // `transferAssetsUsingTypeAndThen` with Asset Hub as the explicit reserve
  // (see getTransferAssetsUsingTypeAndThenParams). Between system chains
  // (Asset Hub, Collectives) the relay native is teleported directly.
  if (isHydrationChain(sourceChain) || isHydrationChain(destinationChain)) {
    const transferType = isHydrationChain(sourceChain)
      ? "destinationReserve"
      : "localReserve";

    return sourceApi.tx.polkadotXcm.transferAssetsUsingTypeAndThen(
      ...getTransferAssetsUsingTypeAndThenParams({
        api: sourceApi,
        destinationChain,
        transferToAddress,
        amount,
        paraChainId,
        transferType,
      }),
    );
  }

  return sourceApi.tx.polkadotXcm.limitedTeleportAssets(
    {
      V4: {
        parents: 1,
        interior: {
          X1: [
            {
              Parachain: paraChainId,
            },
          ],
        },
      },
    },
    {
      V4: {
        parents: 0,
        interior: {
          X1: [
            getBeneficiaryJunction({
              api: sourceApi,
              destinationChain,
              transferToAddress,
            }),
          ],
        },
      },
    },
    {
      V4: [
        {
          id: DOT_ASSET_LOCATION,
          fun: {
            Fungible: amount,
          },
        },
      ],
    },
    0,
    { Unlimited: null },
  );
}
