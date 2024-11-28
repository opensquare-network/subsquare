import getOriginForExtension from "next-common/utils/extension/origin";

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
