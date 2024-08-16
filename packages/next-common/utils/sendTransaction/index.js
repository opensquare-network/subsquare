export const { sendSubstrateTx } = require("./sendSubstrateTx");
export const { sendEvmTx } = require("./sendEvmTx");
export const { maybeSendMimirTx } = require("./sendMimirTx");
export const { maybeSendSignetTx } = require("./sendSignetTx");

export async function getSigner(signerAddress) {
  const { web3Enable, web3FromAddress } = await import(
    "@polkadot/extension-dapp"
  );

  await web3Enable("subsquare");
  const injector = await web3FromAddress(signerAddress);
  return injector.signer;
}
