export const { sendSubstrateTx } = require("./sendSubstrateTx");
export const { sendEvmTx } = require("./sendEvmTx");
export const { maybeSendMimirTx } = require("./sendMimirTx");
export const { maybeSendSignetTx } = require("./sendSignetTx");
export const {
  sendHydraDXMultiFeeEvmTx,
} = require("./sendHydraDXMultiFeeEvmTx");

export async function getSigner(signerAddress) {
  const { web3Enable, web3FromAddress } = await import(
    "@polkadot/extension-dapp"
  );

  await web3Enable("subsquare");
  const injector = await web3FromAddress(signerAddress);
  return injector.signer;
}

export function wrapWithProxy(api, tx, proxyAddress) {
  return api.tx.proxy.proxy(proxyAddress, null, tx);
}

export function getEventData(events, sectionName, methodName) {
  for (const event of events) {
    const { section, method, data } = event.event;
    if (section !== sectionName || method !== methodName) {
      continue;
    }
    return data.toJSON();
  }
}
