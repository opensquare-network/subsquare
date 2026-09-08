import {
  wrapWithMultisig,
  wrapWithProxy,
} from "next-common/utils/sendTransaction/wrap";

// Wrap a plain action call into the FINAL transaction to sign and submit,
// based on the role that describes how the connected account may act for an
// "origin" account (the account that must be the transaction origin):
//
//   role.kind === "direct"   (the connected account IS the origin account):
//       return the plain call, signed directly.
//
//   role.kind === "proxy"    (the connected account is a keyed proxy delegate
//                             of the origin):
//       return proxy.proxy(origin, call), signed directly.
//
//   role.kind === "multisig" (the connected account is a signatory of the
//                             multisig that controls the origin):
//       create a multisig transaction with the connected account, while the
//       origin of the call stays unchanged:
//         - viaProxy=false (the origin itself is the multisig):
//             asMulti(call)
//         - viaProxy=true (the origin is behind a proxy whose delegate is
//           the multisig):
//             asMulti(proxy.proxy(origin, call))
//
// @param api                polkadot api used to build the wrapped tx
// @param role               e.g. from resolveAccountRole
// @param tx                 the inner call to dispatch (raw pallet tx)
// @param connectedAddress   the connected account that will sign
// @param origin             the account whose origin must be achieved; used as
//                           the proxy target for the proxy / viaProxy kinds
//
// The returned tx is already fully wrapped, so submitting it with the
// connected account as the signer needs no further wrapping.
export async function wrapTxByRole(
  api,
  { role, tx, connectedAddress, origin },
) {
  // The connected account is the origin itself: sign the plain call directly.
  if (role?.kind === "direct") {
    return tx;
  }

  // The connected account is a keyed proxy delegate of the origin: dispatch
  // the call through the proxy so the final origin is the origin account.
  if (role?.kind === "proxy") {
    if (!tx || !origin) {
      return null;
    }

    return wrapWithProxy(api, tx, origin);
  }

  // The connected account is a signatory of the controlling multisig: it
  // creates a multisig transaction (asMulti) whose dispatch origin is the
  // origin account.
  if (role?.kind === "multisig") {
    if (!tx || !connectedAddress || !role?.multisig) {
      return null;
    }

    // When the origin account is behind a proxy (e.g. a pure proxy curator),
    // route the call through the proxy first so the final origin is the
    // origin account.
    let dispatchTx = tx;
    if (role.viaProxy) {
      if (!origin) {
        return null;
      }
      dispatchTx = wrapWithProxy(api, tx, origin);
    }

    return wrapWithMultisig(api, dispatchTx, role.multisig, connectedAddress);
  }

  return null;
}
