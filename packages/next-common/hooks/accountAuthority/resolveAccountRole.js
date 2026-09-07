import { isNil } from "lodash-es";
import { isSameAddress } from "next-common/utils/isSameAddress";

// Describe the "shape" of an account from its authority structure, i.e. the
// ways a transaction can be dispatched with this account as the origin.
//
// The classification is structural (based on on-chain data) and chain
// agnostic: it does not try to look up the backend "pure account" index, it
// only reflects who can act on behalf of the address. In particular:
//   - a "pure proxy" account has no private key and can only be reached
//     through its proxy delegate(s);
//   - a "pure proxy to multisig" account is a pure proxy whose delegate is a
//     multisig account.
//
// @param structure  e.g. from useAccountAuthority: { multisig, delegates }
// @returns flags describing the account, plus the multisig that ultimately
//          controls it (the account itself, or its delegate multisig).
export function classifyAccountAuthority({ multisig, delegates = [] }) {
  const delegateMultisigs = delegates.filter((delegate) => delegate?.multisig);
  const simpleDelegates = delegates.filter((delegate) => !delegate?.multisig);
  const hasDelegates = delegates.length > 0;

  return {
    // The account itself is a multisig account.
    isMultisigAccount: Boolean(multisig),
    // The account has proxy delegates that can act on its behalf.
    hasProxyDelegate: hasDelegates,
    // Pure proxy: no own key path, reached through plain (keyed) delegates.
    isPureProxy: Boolean(
      !multisig && simpleDelegates.length > 0 && delegateMultisigs.length === 0,
    ),
    // Pure proxy backed by a multisig: reached through a multisig delegate.
    isPureProxyToMultisig: Boolean(!multisig && delegateMultisigs.length > 0),
    // Plain address: not a multisig and has no proxy delegates.
    isSimple: Boolean(!multisig && !hasDelegates),
    // The multisig that ultimately controls this account (itself, or its
    // delegate multisig), if any.
    controllingMultisig: multisig || delegateMultisigs[0]?.multisig || null,
  };
}

// Decide how a given user is allowed to dispatch a transaction whose origin
// must be `origin`, based on the origin account's authority structure.
//
// A call can only run with the origin account as its origin:
//   - a plain account holds a private key, so its owner signs directly;
//   - a pure proxy account has no key, it must be dispatched by its delegate
//     stored in `Proxy.Proxies(origin)` through `proxy.proxy(origin, call)`.
//
// An account may connect to the system either:
//   - AS the account itself (its address == one of the user's addresses). It
//     is treated like a plain signer: even when the account is a multisig, a
//     multisig-capable wallet (e.g. Mimir) rewrites the signature into a
//     multisig transaction, so we do NOT build asMulti ourselves;
//   - AS ONE OF ITS SIGNATORIES (a member holding its own private key). A
//     member key cannot dispatch as the multisig directly, so the app must
//     build the multisig transaction (asMulti) itself.
//
// @param origin          the account that must be the transaction origin
// @param structure       resolved by useAccountAuthority: { multisig, delegates }
// @param userAddresses   all addresses the current user can sign with
//
// @returns
//   null                          -> user cannot dispatch a call for origin
//   { kind: "direct" }            -> user is (or acts as) the origin itself;
//                                    sign the call directly (if the origin is
//                                    a multisig, the wallet handles asMulti)
//   { kind: "proxy", proxy }      -> user is a proxy delegate of origin (even
//                                    if that delegate is a multisig signed via
//                                    a multisig wallet); only the origin proxy
//                                    wrapping is applied
//   { kind: "multisig", multisig, viaProxy }
//     - the user is a SIGNATORY of `multisig` (member with its own key); the
//       app creates the multisig transaction
//     - viaProxy=false: origin itself is the multisig (asMulti(call))
//     - viaProxy=true:  origin is behind a proxy whose delegate is the
//       multisig (asMulti(proxy.proxy(origin, call)))
export function resolveAccountRole(origin, structure, userAddresses = []) {
  if (isNil(origin) || !structure) {
    return null;
  }

  const isOneOfUserAddresses = (address) =>
    userAddresses.some((userAddress) => isSameAddress(address, userAddress));

  const isUserASignatory = (multisig) =>
    (multisig?.signatories || []).some((signatory) =>
      isOneOfUserAddresses(signatory),
    );

  const userIs = (address) => isOneOfUserAddresses(address);

  // 1. The user is (or acts as) the origin itself. Sign the call directly; if
  //    the origin is a multisig, the connected multisig wallet handles the
  //    asMulti rewriting.
  if (userIs(origin)) {
    return { kind: "direct" };
  }

  // 2. The origin itself is a multisig and the user is one of its signatories
  //    (a member with its own key): build asMulti(call) so the origin becomes
  //    the multisig.
  if (structure.multisig && isUserASignatory(structure.multisig)) {
    return {
      kind: "multisig",
      multisig: structure.multisig,
      viaProxy: false,
    };
  }

  // 3. The origin is controlled through its proxy delegate(s):
  for (const delegate of structure.delegates || []) {
    //    - a signatory of a multisig delegate (member with its own key):
    //      build asMulti(proxy.proxy(origin, call));
    if (delegate?.multisig && isUserASignatory(delegate.multisig)) {
      return {
        kind: "multisig",
        multisig: delegate.multisig,
        viaProxy: true,
      };
    }

    //    - the user IS the delegate itself (a plain account, or a multisig
    //      connected as a signer via a multisig wallet): only wrap through the
    //      origin proxy, proxy.proxy(origin, call).
    if (userIs(delegate?.delegate)) {
      return { kind: "proxy", proxy: delegate.delegate };
    }
  }

  return null;
}
