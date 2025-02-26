import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useSubAccount } from "./account/useSubAccount";
import { useCallback } from "react";

/**
 * @file https://github.com/polkadot-cloud/polkadot-developer-console/blob/main/packages/app/src/hooks/useBuildPayload/index.tsx
 * @link https://docs.reown.com/advanced/multichain/polkadot/dapp-integration-guide#example-namespace-and-sign-client-connect-call
 */
export function useWalletConnectBuildPayload() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const from = signerAccount?.address;

  const { data } = useSubAccount(from);

  const nonceRaw = data?.account?.nonce?.toNumber() || 0;

  return useCallback(
    async (tx) => {
      const lastHeader = await api.rpc.chain.getHeader();
      const blockNumber = api.registry.createType(
        "BlockNumber",
        lastHeader.number.toNumber(),
      );
      const method = api.createType("Call", tx);
      const era = api.registry.createType("ExtrinsicEra", {
        current: lastHeader.number.toNumber(),
        period: 64,
      });

      const nonce = api.registry.createType("Compact<Index>", nonceRaw);

      const payload = {
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
        runtimeVersion: api.runtimeVersion,
        version: tx.version,
        address: from,
        blockHash: lastHeader.hash.toHex(),
        blockNumber: blockNumber.toHex(),
        era: era.toHex(),
        genesisHash: api.genesisHash.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        signedExtensions: api.registry.signedExtensions,
        tip: api.registry.createType("Compact<Balance>", 0).toHex(),
      };

      return payload;
    },
    [api, nonceRaw, from],
  );
}
