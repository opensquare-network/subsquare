import { sortAddresses } from "@polkadot/util-crypto";

// Wrap a transaction so that it is dispatched through a proxy, i.e. the
// actual origin of the call becomes `proxyAddress`. Used when the connected
// account is a proxy of `proxyAddress`, or when a call must be dispatched by
// a (pure) proxy origin that has no private key.
export function wrapWithProxy(api, tx, proxyAddress) {
  return api.tx.proxy.proxy(proxyAddress, null, tx);
}

// Wrap a transaction as a multisig transaction (multisig.asMulti). It will be
// signed by `userAddress` (a signatory) and, once the threshold is reached,
// dispatched with the multisig address as the origin.
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
