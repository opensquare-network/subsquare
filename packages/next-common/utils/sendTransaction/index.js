import getOriginForExtension from "next-common/utils/extension/origin";
import { wrapWithMultisig, wrapWithProxy } from "./wrap";

export { wrapWithMultisig, wrapWithProxy };

export {
  getFeeAssetMultiLocation,
  signAndSendSubstrateTx,
  sendSubstrateTx,
} from "./sendSubstrateTx";
export { sendEvmTx } from "./sendEvmTx";
export { maybeSendMimirTx } from "./sendMimirTx";
export { maybeSendSignetTx } from "./sendSignetTx";
export { sendHydraDXMultiFeeEvmTx } from "./sendHydraDXMultiFeeEvmTx";

export async function getSigner(signerAddress) {
  const { web3Enable, web3FromAddress } = await import(
    "@polkadot/extension-dapp"
  );

  await web3Enable(getOriginForExtension());
  const injector = await web3FromAddress(signerAddress);
  return injector.signer;
}

export async function wrapTransaction(api, tx, signerAccount) {
  let wrappedTx = tx;

  if (signerAccount?.multisig) {
    const multisigUserAddress =
      signerAccount.proxyAddress || signerAccount.address;

    wrappedTx = await wrapWithMultisig(
      api,
      tx,
      signerAccount.multisig,
      multisigUserAddress,
    );
  } else if (signerAccount.selectedProxyAddress) {
    wrappedTx = wrapWithProxy(api, tx, signerAccount.selectedProxyAddress);
  }

  if (signerAccount.proxyAddress) {
    wrappedTx = wrapWithProxy(api, wrappedTx, signerAccount.proxyAddress);
  }

  return wrappedTx;
}

export function getEventData(events, sectionName, methodName) {
  if (!events) {
    return;
  }
  for (const event of events) {
    const { section, method, data } = event.event;
    if (section !== sectionName || method !== methodName) {
      continue;
    }
    return data.toJSON();
  }
}
