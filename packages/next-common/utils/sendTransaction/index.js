import getOriginForExtension from "next-common/utils/extension/origin";
import { sortAddresses } from "@polkadot/util-crypto";

export { sendSubstrateTx } from "./sendSubstrateTx";
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

export function wrapWithProxy(api, tx, proxyAddress) {
  return api.tx.proxy.proxy(proxyAddress, null, tx);
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

export async function wrapWithMultisig(api, tx, multisig, userAddress) {
  const callData = tx.method.toHex();
  const result = await tx.paymentInfo(multisig.multisigAddress);
  const weight = result.weight;

  const otherSigners = sortAddresses(
    multisig.signatories.filter((signer) => signer !== userAddress),
  );

  return api.tx.multisig.asMulti(
    multisig.threshold,
    otherSigners,
    multisig.when,
    callData,
    weight,
  );
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
