import {
  isAssetHubChain,
  isHydrationChain,
  isPeopleChain,
  isCoretimeChain,
} from "next-common/utils/chain";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import Chains from "next-common/utils/consts/chains";

export const AssetHubParaId = 1000;
export const CollectivesParaId = 1001;
export const PeopleParaId = 1004;
export const CoretimeParaId = 1005;
export const HydradxParaId = 2034;

export function getParaChainId(chain) {
  if (isAssetHubChain(chain)) {
    return AssetHubParaId;
  } else if (chain === Chains.collectives) {
    return CollectivesParaId;
  } else if (isPeopleChain(chain)) {
    return PeopleParaId;
  } else if (isCoretimeChain(chain)) {
    return CoretimeParaId;
  } else if (chain === Chains.hydradx) {
    return HydradxParaId;
  }
  throw new Error("Unsupported para chain");
}

// Asset Hub and Hydration support Ethereum-style (H160) accounts, which must
// be addressed via the AccountKey20 XCM junction. Other para chains only
// support AccountId32.
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

function getTeleportParamsFromRelayChainToParaChain({
  api,
  destinationChain,
  transferToAddress,
  amount,
  paraChainId,
}) {
  return [
    {
      V4: {
        parents: 0,
        interior: {
          X1: [
            {
              ParaChain: paraChainId,
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
              api,
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
          id: {
            parents: 0,
            interior: "Here",
          },
          fun: {
            Fungible: amount,
          },
        },
      ],
    },
    0,
    { Unlimited: null },
  ];
}

export default function teleportFromRelayChainToParaChain({
  sourceApi,
  destinationChain,
  transferToAddress,
  amount,
  paraChainId,
}) {
  const params = getTeleportParamsFromRelayChainToParaChain({
    api: sourceApi,
    destinationChain,
    transferToAddress,
    amount,
    paraChainId,
  });
  return sourceApi.tx.xcmPallet.limitedTeleportAssets(...params);
}
