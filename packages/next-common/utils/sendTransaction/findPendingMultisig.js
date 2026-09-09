import { isNil } from "lodash-es";

// Find the multisigs that already have `call` pending on-chain as an
// operation that dispatches with `origin` as the final origin, i.e. entries in
// `Multisig.Multisigs` for (multisigAddress, callHash).
//
// A multisig operation is keyed by (multisigAddress, callHash) and storage
// cannot be enumerated by call hash, so we enumerate every multisig that
// could host such an operation from the origin's account `authority`:
//   - the origin itself when it is a multisig account (its signatories
//     dispatch the plain call with the origin as the multisig origin);
//   - every multisig delegate of the origin in Proxy.Proxies(origin), which
//     dispatch through proxy.proxy(origin, call) so the final origin is still
//     the origin.
// Both are present in `authority` regardless of the current user's
// membership, so operations initiated by others (through a multisig the user
// is not a signatory of) are detected too.
//
// @param api       polkadot api used to build the wrapped calls and query
// @param call      the inner call that a multisig would dispatch
// @param origin    the account that must be the final transaction origin
// @param authority the origin's account authority, e.g. from
//                  useAccountAuthority / useAccountRole
//                  ({ multisig, delegates })
// @returns Promise<Array<string>> the multisig addresses that already have
//          this exact call pending; empty when none.
export async function findPendingMultisig(api, call, origin, authority) {
  if (!api?.query?.multisig?.multisigs || !call || isNil(origin)) {
    return [];
  }

  const candidates = [];

  // The origin itself is a multisig: its signatories dispatch the plain call
  // with the origin as the multisig origin.
  if (authority?.multisig?.multisigAddress) {
    candidates.push({
      multisigAddress: authority.multisig.multisigAddress,
      dispatchTx: call,
    });
  }

  // A multisig delegate of the origin dispatches through
  // proxy.proxy(origin, call) first, so the final origin is the origin.
  for (const delegate of authority?.delegates || []) {
    const multisigAddress = delegate?.multisig?.multisigAddress;
    if (!multisigAddress) {
      continue;
    }
    const dispatchTx = api.tx.proxy?.proxy(origin, null, call);
    if (dispatchTx) {
      candidates.push({ multisigAddress, dispatchTx });
    }
  }

  if (candidates.length === 0) {
    return [];
  }

  const found = await Promise.all(
    candidates.map(async ({ multisigAddress, dispatchTx }) => {
      try {
        const existing = await api.query.multisig.multisigs(
          multisigAddress,
          dispatchTx.method.hash,
        );
        return existing?.isSome ? multisigAddress : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
  );

  return found.filter(Boolean);
}
